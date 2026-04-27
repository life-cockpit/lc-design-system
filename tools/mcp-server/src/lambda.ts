import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';

/**
 * AWS Lambda handler for the MCP server.
 * Deployed behind CloudFront at mcp.life-cockpit.de
 */
export async function handler(event: {
  requestContext: { http: { method: string; path: string } };
  headers: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
}) {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  // CORS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id',
        'Access-Control-Expose-Headers': 'mcp-session-id',
      },
    };
  }

  // Health check
  if (method === 'GET' && path === '/health') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', service: 'life-cockpit-mcp' }),
    };
  }

  // MCP endpoint: create a stateless transport per request
  if (path === '/mcp' || path === '/') {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    });

    const mcpServer = createServer();
    await mcpServer.connect(transport);

    // Build a mock IncomingMessage-like request for the transport
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString()
      : event.body || '';

    // Collect response using a simple response collector
    const responseChunks: string[] = [];
    let statusCode = 200;
    const responseHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'mcp-session-id',
    };

    const mockReq = {
      method,
      headers: Object.fromEntries(
        Object.entries(event.headers).map(([k, v]) => [k.toLowerCase(), v])
      ),
      url: path,
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(body);
      },
    };

    const mockRes = {
      writeHead(code: number, headers?: Record<string, string>) {
        statusCode = code;
        if (headers) Object.assign(responseHeaders, headers);
      },
      setHeader(name: string, value: string) {
        responseHeaders[name] = value;
      },
      end(data?: string) {
        if (data) responseChunks.push(data);
      },
      write(data: string) {
        responseChunks.push(data);
        return true;
      },
    };

    await transport.handleRequest(mockReq as any, mockRes as any);

    return {
      statusCode,
      headers: responseHeaders,
      body: responseChunks.join(''),
    };
  }

  return { statusCode: 404, body: 'Not found' };
}
