import { createStorybookMcpHandler } from '@storybook/mcp';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'https://design.life-cockpit.de';

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

export async function lambdaHandler(event: {
  requestContext: { http: { method: string; path: string } };
  headers: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
}) {
  const mcpHandler = await getHandler();

  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;
  const headers = new Headers(event.headers);
  const body = event.body
    ? event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString()
      : event.body
    : undefined;

  const url = `${STORYBOOK_URL}${path}`;
  const request = new Request(url, { method, headers, body });

  const response = await mcpHandler(request, { request });

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  // Add CORS headers
  responseHeaders['access-control-allow-origin'] = '*';
  responseHeaders['access-control-allow-methods'] = 'GET, POST, OPTIONS';
  responseHeaders['access-control-allow-headers'] = 'content-type';

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: responseHeaders, body: '' };
  }

  const responseBody = await response.text();

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: responseBody,
  };
}
