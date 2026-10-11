/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan every page AND the JS that injects the shared nav/footer,
  // so utility classes used there are never purged.
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        bitcoin: { DEFAULT: 'var(--bitcoin)', bright: 'var(--bitcoin-bright)' },
        gold: 'var(--gold)',
        up: 'var(--up)',
        down: 'var(--down)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        line: 'var(--line)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace']
      }
    }
  },
  plugins: []
};
