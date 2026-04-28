const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [join(__dirname, 'src/**/*.{html,ts}')],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (lc-design #208497 → #D5E5E9)
        primary: {
          50: '#F0F8FA',
          100: '#E0F1F4',
          200: '#C1E3E9',
          300: '#A3D5DF',
          400: '#84C7D4',
          500: '#208497', // Primary brand color
          600: '#1A6A79',
          700: '#144F5B',
          800: '#0D353D',
          900: '#071A1F',
        },
        // Secondary brand colors (lc-design #7097AF → #F5F8F9)
        secondary: {
          50: '#F5F8F9',
          100: '#EBF1F3',
          200: '#D7E3E7',
          300: '#C3D5DB',
          400: '#AFC7CF',
          500: '#7097AF', // Secondary brand color
          600: '#5A798C',
          700: '#435B69',
          800: '#2D3C46',
          900: '#161E23',
        },
        // Neutral colors (grays and blacks)
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Semantic colors
        success: {
          DEFAULT: '#8EA475',
          light: '#CDD6C2',
          dark: '#5F7150',
        },
        error: {
          DEFAULT: '#9D0E0E',
          light: '#F7A1A1',
          dark: '#6B0909',
        },
        warning: {
          DEFAULT: '#E1A040',
          light: '#F1D3A7',
          dark: '#9B6B2B',
        },
        info: {
          DEFAULT: '#3B6588',
          light: '#B8CEE0',
          dark: '#27445C',
        },
        // Accent colors from lc-design additional colors
        accent: {
          orange: '#DF792E',
          purple: '#866AA0',
          red: '#9E3846',
          rust: '#C6592E',
          violet: '#4E3F84',
        },
      },
      spacing: {
        // 4px grid system (0.25rem = 4px)
        0.5: '0.125rem', // 2px
        1: '0.25rem', // 4px
        1.5: '0.375rem', // 6px
        2: '0.5rem', // 8px
        2.5: '0.625rem', // 10px
        3: '0.75rem', // 12px
        3.5: '0.875rem', // 14px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        7: '1.75rem', // 28px
        8: '2rem', // 32px
        9: '2.25rem', // 36px
        10: '2.5rem', // 40px
        11: '2.75rem', // 44px (minimum touch target)
        12: '3rem', // 48px
        14: '3.5rem', // 56px
        16: '4rem', // 64px
        20: '5rem', // 80px
        24: '6rem', // 96px
        28: '7rem', // 112px
        32: '8rem', // 128px
        36: '9rem', // 144px
        40: '10rem', // 160px
        44: '11rem', // 176px
        48: '12rem', // 192px
        52: '13rem', // 208px
        56: '14rem', // 224px
        60: '15rem', // 240px
        64: '16rem', // 256px
        72: '18rem', // 288px
        80: '20rem', // 320px
        96: '24rem', // 384px
      },
      fontSize: {
        // Typography scale
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.5rem', // 24px
        full: '9999px',
      },
      boxShadow: {
        // Elevation system (4 levels)
        'elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        150: '150ms', // Standard animation duration
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-in',
        'fade-out': 'fadeOut 150ms ease-out',
        'slide-in-up': 'slideInUp 150ms ease-out',
        'slide-in-down': 'slideInDown 150ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      minWidth: {
        44: '2.75rem', // 44px minimum touch target
      },
      minHeight: {
        44: '2.75rem', // 44px minimum touch target
      },
    },
  },
  plugins: [],
};
