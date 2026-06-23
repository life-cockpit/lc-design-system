/**
 * File-type → icon mapping for the TreeView component.
 *
 * Icon names refer to Tabler Icons (the design system's icon source).
 * Resolution order for a file node:
 *   1. explicit `node.icon`
 *   2. exact file name match (e.g. `package.json`, `Dockerfile`)
 *   3. file extension match (e.g. `.ts`, `.png`)
 *   4. generic file fallback
 */

/** Icon used for collapsed folders. */
export const FOLDER_ICON = 'folder';
/** Icon used for expanded (open) folders. */
export const FOLDER_OPEN_ICON = 'folder-open';
/** Generic fallback icon for files with no specific match. */
export const FILE_FALLBACK_ICON = 'file';

/** Map of well-known file names (lower-cased) to icons. */
const FILE_NAME_ICONS: Record<string, string> = {
  'package.json': 'brand-npm',
  'package-lock.json': 'brand-npm',
  'yarn.lock': 'brand-yarn',
  'pnpm-lock.yaml': 'brand-pnpm',
  'dockerfile': 'brand-docker',
  'docker-compose.yml': 'brand-docker',
  'docker-compose.yaml': 'brand-docker',
  '.gitignore': 'brand-git',
  '.gitattributes': 'brand-git',
  '.gitmodules': 'brand-git',
  'readme.md': 'book',
  'license': 'license',
  'license.md': 'license',
  '.env': 'key',
  '.env.local': 'key',
  '.editorconfig': 'settings',
  '.prettierrc': 'settings',
  '.eslintrc': 'settings',
  'tsconfig.json': 'brand-typescript',
  'angular.json': 'brand-angular',
  'nx.json': 'settings',
  'makefile': 'terminal',
};

/** Map of file extensions (without dot, lower-cased) to icons. */
const FILE_EXT_ICONS: Record<string, string> = {
  // Languages
  ts: 'brand-typescript',
  tsx: 'brand-typescript',
  js: 'brand-javascript',
  jsx: 'brand-javascript',
  mjs: 'brand-javascript',
  cjs: 'brand-javascript',
  html: 'brand-html5',
  htm: 'brand-html5',
  css: 'brand-css3',
  scss: 'brand-sass',
  sass: 'brand-sass',
  less: 'brand-css3',
  py: 'brand-python',
  rb: 'diamond',
  go: 'brand-golang',
  rs: 'brand-rust',
  java: 'coffee',
  kt: 'brand-kotlin',
  swift: 'brand-swift',
  c: 'file-code',
  h: 'file-code',
  cpp: 'brand-cpp',
  cs: 'brand-c-sharp',
  php: 'brand-php',
  dart: 'brand-flutter',
  sh: 'terminal-2',
  bash: 'terminal-2',
  zsh: 'terminal-2',
  sql: 'database',
  // Data / config
  json: 'braces',
  jsonc: 'braces',
  yml: 'file-code',
  yaml: 'file-code',
  toml: 'file-code',
  xml: 'file-code',
  ini: 'settings',
  env: 'key',
  // Docs
  md: 'markdown',
  mdx: 'markdown',
  txt: 'file-text',
  pdf: 'file-type-pdf',
  doc: 'file-text',
  docx: 'file-text',
  csv: 'file-spreadsheet',
  xls: 'file-spreadsheet',
  xlsx: 'file-spreadsheet',
  // Images
  png: 'photo',
  jpg: 'photo',
  jpeg: 'photo',
  gif: 'photo',
  webp: 'photo',
  svg: 'file-vector',
  ico: 'photo',
  bmp: 'photo',
  // Media
  mp3: 'music',
  wav: 'music',
  mp4: 'video',
  mov: 'video',
  webm: 'video',
  // Archives
  zip: 'file-zip',
  tar: 'file-zip',
  gz: 'file-zip',
  rar: 'file-zip',
  '7z': 'file-zip',
  // Fonts
  woff: 'typography',
  woff2: 'typography',
  ttf: 'typography',
  otf: 'typography',
  // Misc
  lock: 'lock',
};

/**
 * Resolve the icon name for a file based on its name.
 * Performs exact-name then extension lookup, falling back to a generic file icon.
 */
export function resolveFileIcon(fileName: string): string {
  const lower = fileName.toLowerCase();

  const byName = FILE_NAME_ICONS[lower];
  if (byName) return byName;

  const dotIndex = lower.lastIndexOf('.');
  if (dotIndex > 0 && dotIndex < lower.length - 1) {
    const ext = lower.slice(dotIndex + 1);
    const byExt = FILE_EXT_ICONS[ext];
    if (byExt) return byExt;
  }

  return FILE_FALLBACK_ICON;
}
