/**
 * Style Dictionary Configuration
 * Generates design tokens in TypeScript and SCSS formats
 */

module.exports = {
  source: ['tokens.json'],
  platforms: {
    typescript: {
      transformGroup: 'js',
      buildPath: 'src/lib/tokens/',
      files: [
        {
          destination: 'index.ts',
          format: 'javascript/es6',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/styles/tokens/',
      files: [
        {
          destination: '_colors.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'color';
          },
          options: {
            outputReferences: false,
          },
        },
        {
          destination: '_spacing.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'spacing';
          },
        },
        {
          destination: '_typography.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'typography';
          },
        },
        {
          destination: '_elevation.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'elevation';
          },
        },
        {
          destination: '_border-radius.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'borderRadius';
          },
        },
        {
          destination: '_animation.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'animation';
          },
        },
        {
          destination: '_size.scss',
          format: 'scss/variables',
          filter: function (token) {
            return token.path[0] === 'size';
          },
        },
        {
          destination: '_all.scss',
          format: 'scss/variables',
        },
      ],
    },
  },
};
