/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              marginTop: '1.5em',
              marginBottom: '0.5em',
              fontSize: '2.25em'
            },
            h2: {
              marginTop: '1.25em',
              marginBottom: '0.5em',
              fontSize: '1.875em'
            },
            h3: {
              marginTop: '1em',
              marginBottom: '0.5em',
              fontSize: '1.5em'
            },
            blockquote: {
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#e5e7eb',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: '#4b5563'
            },
            'ul > li': {
              paddingLeft: '1.5em',
              position: 'relative'
            },
            'ol > li': {
              paddingLeft: '1.5em',
              position: 'relative'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
