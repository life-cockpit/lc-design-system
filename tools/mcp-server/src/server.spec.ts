import { describe, it, expect, beforeAll } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createServer } from './server.js';

describe('MCP Server', () => {
  let server: McpServer;

  beforeAll(() => {
    server = createServer();
  });

  it('should create a server instance', () => {
    expect(server).toBeDefined();
    expect(server).toBeInstanceOf(McpServer);
  });

  it('should create independent instances per call', () => {
    const server1 = createServer();
    const server2 = createServer();
    expect(server1).not.toBe(server2);
  });
});

describe('MCP Tools', () => {
  /**
   * Helper: connect server + call a tool, return { content, isError }
   */
  async function callTool(
    toolName: string,
    args: Record<string, unknown> = {},
  ): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
    const server = createServer();

    // Use internal tool registry to call tools directly
    // McpServer stores tools in a private map; we access via the handler
    const { InMemoryTransport } = await import(
      '@modelcontextprotocol/sdk/inMemory.js'
    );
    const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const client = new Client({ name: 'test-client', version: '1.0.0' });

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.callTool({ name: toolName, arguments: args });
    return result as { content: Array<{ type: string; text: string }>; isError?: boolean };
  }

  describe('list_components', () => {
    it('should return a list of components', async () => {
      const result = await callTool('list_components');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const components = JSON.parse(result.content[0].text);
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
      expect(components[0]).toHaveProperty('name');
      expect(components[0]).toHaveProperty('selector');
      expect(components[0]).toHaveProperty('category');
      expect(components[0]).toHaveProperty('description');
    });

    it('should include known components', async () => {
      const result = await callTool('list_components');
      const components = JSON.parse(result.content[0].text);
      const names = components.map((c: { name: string }) => c.name);

      expect(names).toContain('ButtonComponent');
      expect(names).toContain('CardComponent');
      expect(names).toContain('InputComponent');
    });
  });

  describe('get_component', () => {
    it('should return full component details by selector', async () => {
      const result = await callTool('get_component', { selector: 'lc-button' });
      expect(result.isError).toBeFalsy();

      const component = JSON.parse(result.content[0].text);
      expect(component.name).toBe('ButtonComponent');
      expect(component.selector).toBe('lc-button');
      expect(component).toHaveProperty('inputs');
      expect(component).toHaveProperty('outputs');
      expect(component).toHaveProperty('category');
    });

    it('should return component by name', async () => {
      const result = await callTool('get_component', { selector: 'ButtonComponent' });
      expect(result.isError).toBeFalsy();

      const component = JSON.parse(result.content[0].text);
      expect(component.selector).toBe('lc-button');
    });

    it('should return component by short name', async () => {
      const result = await callTool('get_component', { selector: 'button' });
      expect(result.isError).toBeFalsy();

      const component = JSON.parse(result.content[0].text);
      expect(component.selector).toBe('lc-button');
    });

    it('should return error for unknown component', async () => {
      const result = await callTool('get_component', {
        selector: 'non-existent-component',
      });
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('not found');
    });
  });

  describe('get_components_by_category', () => {
    it('should return components for valid category', async () => {
      const result = await callTool('get_components_by_category', {
        category: 'Form',
      });
      expect(result.isError).toBeFalsy();

      const components = JSON.parse(result.content[0].text);
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
      expect(components.every((c: { category: string }) => c.category === 'Form')).toBe(
        true,
      );
    });

    it('should be case-insensitive', async () => {
      const result = await callTool('get_components_by_category', {
        category: 'form',
      });
      expect(result.isError).toBeFalsy();

      const components = JSON.parse(result.content[0].text);
      expect(components.length).toBeGreaterThan(0);
    });

    it('should return error for unknown category', async () => {
      const result = await callTool('get_components_by_category', {
        category: 'NonExistent',
      });
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Available categories');
    });
  });

  describe('search_components', () => {
    it('should find components by name', async () => {
      const result = await callTool('search_components', { query: 'button' });
      const components = JSON.parse(result.content[0].text);

      expect(components.length).toBeGreaterThan(0);
      expect(
        components.some((c: { name: string }) =>
          c.name.toLowerCase().includes('button'),
        ),
      ).toBe(true);
    });

    it('should find components by description keyword', async () => {
      const result = await callTool('search_components', { query: 'input' });
      const components = JSON.parse(result.content[0].text);

      expect(components.length).toBeGreaterThan(0);
    });

    it('should return empty result for no match', async () => {
      const result = await callTool('search_components', {
        query: 'xyznonexistent123',
      });
      expect(result.content[0].text).toContain('No components found');
    });
  });

  describe('get_design_tokens', () => {
    it('should return token information', async () => {
      const result = await callTool('get_design_tokens');
      const tokens = JSON.parse(result.content[0].text);

      expect(tokens).toHaveProperty('description');
      expect(tokens).toHaveProperty('categories');
      expect(tokens).toHaveProperty('scss_usage');
      expect(tokens).toHaveProperty('css_usage');
      expect(Array.isArray(tokens.categories)).toBe(true);
    });
  });

  describe('get_usage_guide', () => {
    it('should return installation guide', async () => {
      const result = await callTool('get_usage_guide');
      const guide = JSON.parse(result.content[0].text);

      expect(guide).toHaveProperty('name', '@life-cockpit/angular-ui-kit');
      expect(guide).toHaveProperty('framework');
      expect(guide).toHaveProperty('installation');
      expect(guide).toHaveProperty('example');
      expect(guide).toHaveProperty('peerDependencies');
    });
  });
});
