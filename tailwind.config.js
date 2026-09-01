module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
      },
      boxShadow: {
        glow: '0 0 24px rgba(113, 102, 255, 0.25), 0 0 48px rgba(113, 102, 255, 0.1)',
        'glow-sm': '0 0 12px rgba(113, 102, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
