import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {},
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
export default config;
