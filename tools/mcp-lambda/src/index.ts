import { createStorybookMcpHandler } from '@storybook/mcp';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'https://design.life-cockpit.de';

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, mcp-session-id',
};

async function fetchManifest(_request: unknown, path: string) {
  const url = `${STORYBOOK_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch manifest from ${url}: ${res.status}`);
  }
  return res.text();
}

let handler: Awaited<ReturnType<typeof createStorybookMcpHandler>> | null = null;

async function getHandler() {
  if (!handler) {
    handler = await createStorybookMcpHandler({
      manifestProvider: fetchManifest,
    });
  }
  return handler;
}

async function readStreamWithTimeout(body: ReadableStream<Uint8Array>, timeoutMs: number): Promise<string> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  const decoder = new TextDecoder();

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Stream read timeout')), timeoutMs)
  );

  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) break;
      if (value) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return chunks.map((c) => decoder.decode(c, { stream: true })).join('') + decoder.decode();
}

export async function lambdaHandler(event: {
  requestContext: { http: { method: string; path: string } };
  headers: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
}) {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  // OPTIONS - CORS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  // GET - SSE streaming is not supported in Lambda (would hang forever)
  if (method === 'GET') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json', Allow: 'POST, DELETE, OPTIONS' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'SSE streaming not supported. Use POST for all requests.' },
        id: null,
      }),
    };
  }

  // DELETE - session cleanup
  if (method === 'DELETE') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  // POST - process MCP request
  const mcpHandler = await getHandler();

  const headers = new Headers(event.headers);
  const body = event.body
    ? event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString()
      : event.body
    : undefined;

  const url = `${STORYBOOK_URL}${path}`;
  const request = new Request(url, { method, headers, body });

  let response: Response;
  try {
    response = await mcpHandler(request, { request });
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: `Internal error: ${(err as Error).message}` },
        id: null,
      }),
    };
  }

  const responseHeaders: Record<string, string> = { ...CORS_HEADERS };
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });
  // Ensure CORS headers are not overwritten
  Object.assign(responseHeaders, CORS_HEADERS);

  // Read response body - use stream reader with timeout for SSE responses
  let responseBody = '';
  if (response.body) {
    try {
      responseBody = await readStreamWithTimeout(response.body, 25000);
    } catch {
      return {
        statusCode: 504,
        headers: { ...responseHeaders, 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32000, message: 'Request processing timed out' },
          id: null,
        }),
      };
    }
  }

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: responseBody,
  };
}
