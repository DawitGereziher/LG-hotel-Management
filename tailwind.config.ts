import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E', // Green button color
        sidebar: '#ECFDF5'  // Sidebar background
      }
    }
  },
  plugins: []
};

export default config;
