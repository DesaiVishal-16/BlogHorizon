import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}
