/**
 * Patches @storybook/angular to work with Nx workspace setup.
 *
 * Issue: Nx passes options to Angular CLI builders via the architect scheduler,
 * which validates options against the builder's schema (additionalProperties: false).
 * The browserTarget option gets stripped during this validation before reaching
 * the Storybook framework preset. The preset then throws
 * SB_FRAMEWORK_ANGULAR_0001 (AngularLegacyBuildOptionsError).
 *
 * Fix: Bypass the checkForLegacyBuildOptions check. The preset's getBuilderOptions
 * already falls back gracefully when angularBrowserTarget is undefined, using
 * tsConfig from options directly.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '../node_modules/@storybook/angular/dist/server/framework-preset-angular-cli.js'
);

if (!fs.existsSync(filePath)) {
  console.log('[patch] @storybook/angular not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');

const original = 'function checkForLegacyBuildOptions(options) {\n  if (options.angularBrowserTarget === void 0)\n    throw new AngularLegacyBuildOptionsError();';
const patched = 'function checkForLegacyBuildOptions(options) {\n  return; // Patched: Nx strips browserTarget during architect validation\n  if (options.angularBrowserTarget === void 0)\n    throw new AngularLegacyBuildOptionsError();';

if (content.includes(patched)) {
  console.log('[patch] @storybook/angular already patched.');
  process.exit(0);
}

if (!content.includes(original)) {
  // Try single-line variant (minified)
  const originalOneLine = 'function checkForLegacyBuildOptions(options) {';
  if (content.includes(originalOneLine)) {
    content = content.replace(
      originalOneLine,
      'function checkForLegacyBuildOptions(options) { return;'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[patch] @storybook/angular patched successfully (single-line).');
    process.exit(0);
  }
  console.log('[patch] Could not find expected code in @storybook/angular. Patch may need updating.');
  process.exit(0);
}

content = content.replace(original, patched);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[patch] @storybook/angular patched successfully.');
