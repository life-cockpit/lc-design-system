const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the angular-ui-kit Tailwind configuration as a preset
  presets: [require('../../libs/angular-ui-kit/tailwind.config.js')],

  content: [
    join(__dirname, 'src/**/*.{html,ts}'),
    join(__dirname, '../../libs/angular-ui-kit/src/**/*.{html,ts}'),
  ],

  theme: {
    extend: {
      // Demo app can extend or override angular-ui-kit theme here if needed
    },
  },

  plugins: [],
};
