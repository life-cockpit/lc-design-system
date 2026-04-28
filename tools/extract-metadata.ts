/**
 * Component Metadata Extraction Script
 *
 * Parses all Angular component .ts files in libs/angular-ui-kit/src/lib/
 * and extracts structured metadata (inputs, outputs, types, descriptions, examples).
 *
 * Supports both:
 * - Classic decorators: @Input(), @Output()
 * - Angular signals: input(), output()
 *
 * Output: libs/angular-ui-kit/component-metadata.json
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Types
// ============================================================================

interface ComponentInput {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

interface ComponentOutput {
  name: string;
  type: string;
  description: string;
}

interface ComponentSlot {
  name: string;
  description: string;
}

interface ComponentMetadata {
  name: string;
  selector: string;
  description: string;
  category: string;
  examples: string[];
  inputs: ComponentInput[];
  outputs: ComponentOutput[];
  types: Record<string, string[]>;
  slots: ComponentSlot[];
  filePath: string;
}

// ============================================================================
// Helpers
// ============================================================================

const LIB_ROOT = path.resolve(__dirname, '../libs/angular-ui-kit/src/lib');
const OUTPUT_PATH = path.resolve(__dirname, '../libs/angular-ui-kit/component-metadata.json');

function getCategory(filePath: string): string {
  const componentName = path.basename(path.dirname(filePath));
  const categories: Record<string, string[]> = {
    'Form': ['button', 'input', 'checkbox', 'radio', 'select', 'switch', 'textarea', 'datepicker', 'password-input', 'email-input', 'verification-code-input', 'field-group', 'filter-bar'],
    'Layout': ['container', 'section', 'spacer', 'stack', 'drawer'],
    'Navigation': ['breadcrumbs', 'header', 'sidenav', 'tabs', 'pagination', 'menu'],
    'Data Display': ['avatar', 'badge', 'card', 'chip', 'icon', 'list', 'logo', 'metric-card', 'table', 'toggle-group', 'typography', 'skeleton', 'spinner'],
    'Feedback': ['alert', 'modal', 'toast', 'tooltip', 'error-display', 'empty-state'],
    'Other': ['accordion', 'stepper', 'theme', 'tokens'],
  };

  for (const [category, components] of Object.entries(categories)) {
    if (components.includes(componentName)) return category;
  }
  return 'Other';
}

function getLeadingComment(node: ts.Node, sourceFile: ts.SourceFile): string {
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
  if (!commentRanges) return '';

  // Get the last JSDoc comment before the node
  for (let i = commentRanges.length - 1; i >= 0; i--) {
    const range = commentRanges[i];
    if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const comment = fullText.slice(range.pos, range.end);
      if (comment.startsWith('/**')) {
        return parseJsDoc(comment);
      }
    }
  }
  return '';
}

function parseJsDoc(comment: string): string {
  return comment
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, ''))
    .filter(line => !line.startsWith('@'))
    .join('\n')
    .trim();
}

function getJsDocTag(node: ts.Node, sourceFile: ts.SourceFile, tag: string): string | undefined {
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
  if (!commentRanges) return undefined;

  for (let i = commentRanges.length - 1; i >= 0; i--) {
    const range = commentRanges[i];
    if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const comment = fullText.slice(range.pos, range.end);
      if (comment.startsWith('/**')) {
        const match = comment.match(new RegExp(`@${tag}\\s+(.+)`));
        if (match) return match[1].replace(/\*\/$/, '').trim();
      }
    }
  }
  return undefined;
}

function getExamples(node: ts.Node, sourceFile: ts.SourceFile): string[] {
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
  if (!commentRanges) return [];

  const examples: string[] = [];
  for (let i = commentRanges.length - 1; i >= 0; i--) {
    const range = commentRanges[i];
    if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const comment = fullText.slice(range.pos, range.end);
      if (comment.startsWith('/**')) {
        const exampleMatches = comment.matchAll(/@example\s*\n\s*\*\s*```(?:html|typescript|ts)?\n([\s\S]*?)```/g);
        for (const match of exampleMatches) {
          const code = match[1]
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, ''))
            .join('\n')
            .trim();
          examples.push(code);
        }
      }
    }
  }
  return examples;
}

function extractTypeFromNode(node: ts.TypeNode | undefined, sourceFile: ts.SourceFile): string {
  if (!node) return 'any';
  return node.getText(sourceFile);
}

// ============================================================================
// Core Extraction
// ============================================================================

function extractComponent(filePath: string): ComponentMetadata | null {
  const source = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

  let metadata: ComponentMetadata | null = null;
  const exportedTypes: Record<string, string[]> = {};

  // First pass: extract type aliases (e.g. export type ButtonVariant = '...' | '...')
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isTypeAliasDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const typeName = node.name.getText(sourceFile);
      if (ts.isUnionTypeNode(node.type)) {
        const values = node.type.types
          .map(t => t.getText(sourceFile).replace(/^['"]|['"]$/g, ''))
          .filter(v => v.length > 0);
        exportedTypes[typeName] = values;
      }
    }
  });

  // Second pass: extract component class
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isClassDeclaration(node)) return;
    if (!node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return;

    // Find @Component decorator
    const decorators = ts.getDecorators(node);
    if (!decorators) return;

    const componentDecorator = decorators.find(d => {
      const expr = d.expression;
      return ts.isCallExpression(expr) && expr.expression.getText(sourceFile) === 'Component';
    });

    if (!componentDecorator) return;

    // Extract selector from decorator
    const decoratorCall = componentDecorator.expression as ts.CallExpression;
    const arg = decoratorCall.arguments[0];
    if (!arg || !ts.isObjectLiteralExpression(arg)) return;

    let selector = '';
    for (const prop of arg.properties) {
      if (ts.isPropertyAssignment(prop) && prop.name.getText(sourceFile) === 'selector') {
        selector = prop.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '');
      }
    }

    if (!selector) return;

    const className = node.name?.getText(sourceFile) || '';
    const description = getLeadingComment(node, sourceFile);
    const examples = getExamples(node, sourceFile);
    const inputs: ComponentInput[] = [];
    const outputs: ComponentOutput[] = [];

    // Extract inputs and outputs from class members
    for (const member of node.members) {
      if (!ts.isPropertyDeclaration(member)) continue;

      const memberName = member.name?.getText(sourceFile) || '';
      const memberComment = getLeadingComment(member, sourceFile);
      const defaultTag = getJsDocTag(member, sourceFile, 'default');

      // Check for @Input() decorator
      const memberDecorators = ts.getDecorators(member);
      if (memberDecorators) {
        for (const dec of memberDecorators) {
          const decExpr = dec.expression;
          if (ts.isCallExpression(decExpr)) {
            const decName = decExpr.expression.getText(sourceFile);

            if (decName === 'Input') {
              const type = member.type
                ? extractTypeFromNode(member.type, sourceFile)
                : inferTypeFromInitializer(member.initializer, sourceFile);
              const defaultValue = member.initializer
                ? member.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '')
                : undefined;
              inputs.push({
                name: memberName,
                type,
                default: defaultTag || defaultValue,
                required: !member.initializer && !member.questionToken,
                description: memberComment,
              });
            }

            if (decName === 'Output') {
              const type = member.type
                ? extractTypeFromNode(member.type, sourceFile)
                : 'EventEmitter<void>';
              inputs; // just to avoid lint
              outputs.push({
                name: memberName,
                type: extractEventEmitterType(type),
                description: memberComment,
              });
            }
          }
        }
      }

      // Check for signal-based input()/output()
      if (member.initializer && ts.isCallExpression(member.initializer)) {
        const callName = member.initializer.expression.getText(sourceFile);

        if (callName === 'input' || callName === 'input.required') {
          const typeArgs = member.initializer.typeArguments;
          let type = 'any';
          if (typeArgs && typeArgs.length > 0) {
            type = typeArgs[0].getText(sourceFile);
          } else if (member.initializer.arguments.length > 0) {
            type = inferTypeFromInitializer(member.initializer.arguments[0], sourceFile);
          }

          const defaultValue = member.initializer.arguments.length > 0
            ? member.initializer.arguments[0].getText(sourceFile).replace(/^['"]|['"]$/g, '')
            : undefined;

          inputs.push({
            name: memberName,
            type,
            default: defaultTag || defaultValue,
            required: callName === 'input.required' || (!defaultValue && !member.initializer.arguments.length),
            description: memberComment,
          });
        }

        if (callName === 'output') {
          const typeArgs = member.initializer.typeArguments;
          const type = typeArgs && typeArgs.length > 0
            ? typeArgs[0].getText(sourceFile)
            : 'void';
          outputs.push({
            name: memberName,
            type,
            description: memberComment,
          });
        }
      }
    }

    metadata = {
      name: className,
      selector,
      description,
      category: getCategory(filePath),
      examples,
      inputs,
      outputs,
      types: exportedTypes,
      slots: extractSlots(filePath),
      filePath: path.relative(path.resolve(__dirname, '..'), filePath),
    };
  });

  return metadata;
}

function inferTypeFromInitializer(initializer: ts.Expression | undefined, sourceFile: ts.SourceFile): string {
  if (!initializer) return 'any';
  const text = initializer.getText(sourceFile);
  if (text === 'true' || text === 'false') return 'boolean';
  if (text.startsWith("'") || text.startsWith('"')) return 'string';
  if (!isNaN(Number(text))) return 'number';
  if (text.startsWith('[')) return 'array';
  if (text.startsWith('{')) return 'object';
  return 'any';
}

function extractEventEmitterType(type: string): string {
  const match = type.match(/EventEmitter<(.+)>/);
  return match ? match[1] : 'void';
}

function extractSlots(componentFilePath: string): ComponentSlot[] {
  const htmlPath = componentFilePath
    .replace('.ts', '.html');

  if (!fs.existsSync(htmlPath)) return [];

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const slots: ComponentSlot[] = [];

  // Look for <ng-content> elements
  const defaultContent = html.match(/<ng-content><\/ng-content>|<ng-content\s*\/>/g);
  if (defaultContent) {
    slots.push({ name: 'default', description: 'Default content projection slot' });
  }

  // Look for named slots: <ng-content select="...">
  const namedSlots = html.matchAll(/<ng-content\s+select="([^"]+)"/g);
  for (const match of namedSlots) {
    slots.push({ name: match[1], description: `Named slot: ${match[1]}` });
  }

  return slots;
}

// ============================================================================
// Main
// ============================================================================

function findComponentFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip tokens and theme directories (they're not UI components)
      if (entry.name !== 'tokens' && entry.name !== 'models') {
        files.push(...findComponentFiles(fullPath));
      }
    } else if (entry.name.endsWith('.component.ts') || entry.name.endsWith('.directive.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  console.log('🔍 Scanning component files...');
  const componentFiles = findComponentFiles(LIB_ROOT);
  console.log(`  Found ${componentFiles.length} component/directive files`);

  const metadata: ComponentMetadata[] = [];
  const errors: string[] = [];

  for (const file of componentFiles) {
    try {
      const result = extractComponent(file);
      if (result) {
        metadata.push(result);
      }
    } catch (e: any) {
      errors.push(`${file}: ${e.message}`);
    }
  }

  // Sort by category, then name
  metadata.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  const output = {
    $schema: './component-metadata.schema.json',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalComponents: metadata.length,
    categories: [...new Set(metadata.map(m => m.category))],
    components: metadata,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n✅ Generated metadata for ${metadata.length} components`);
  console.log(`   Output: ${OUTPUT_PATH}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} errors:`);
    errors.forEach(e => console.log(`   - ${e}`));
  }

  // Summary by category
  console.log('\n📊 By category:');
  const byCategory = metadata.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`   ${cat}: ${count}`);
  }
}

main();
