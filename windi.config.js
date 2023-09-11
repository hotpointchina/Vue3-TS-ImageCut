const colors = require('windicss/colors');
const typography = require('windicss/plugin/typography');
const { transform } = require('windicss/helpers');

export default {
  darkMode: 'class', // or 'media' or 'class'
  extract: {
    include: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  },
  safelist: ['prose', 'prose-sm', 'm-auto'],
  plugins: [transform('daisyui'), typography],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      {
        cptheme: {
          primary: '#057AFF',
          secondary: '#463AA1',
          accent: '#C149AD',
          neutral: '#e7e5e4',
          'base-100': '#FFFFFF',
          info: '#e7e5e4',
          success: '#67c23a',
          warning: '#e6a263',
          error: '#f56c6c',

          '--rounded-btn': '0.2rem',
          '--rounded-box': '1rem', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
          '--animation-btn': '0.25s', // duration of animation when you click on button
          '--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
          '--btn-text-case': 'uppercase', // set default text transform for buttons
          '--btn-focus-scale': '0.95', // scale transform of button when you focus on it
          '--border-btn': '1px', // border width of buttons
          '--tab-border': '1px', // border width of tabs
          '--tab-radius': '0.5rem', // border radius of tabs
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: 'cpvf-',
    darkTheme: 'cptheme',
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      gray: colors.gray,
      red: colors.red,
      white: colors.white,
      green: colors.green,
      yellow: colors.amber,
      blue: colors.blue,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      boxShadow: {
        DEFAULT: '0 1px 3px 2px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
};
