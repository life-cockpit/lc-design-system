const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the ui-kit Tailwind configuration as a preset
  presets: [require('../../libs/ui-kit/tailwind.config.js')],

  content: [
    join(__dirname, 'src/**/*.{html,ts}'),
    join(__dirname, '../../libs/ui-kit/src/**/*.{html,ts}'),
  ],

  theme: {
    extend: {
      // Demo app can extend or override ui-kit theme here if needed
    },
  },

  plugins: [],
};
