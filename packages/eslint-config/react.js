module.exports = {
  ...require('./index.js'),
  extends: [
    ...require('./index.js').extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended'
  ],
  plugins: [...require('./index.js').plugins, 'react', 'react-hooks', 'jsx-a11y', 'tailwindcss'],
  settings: {
    react: {
      version: '19'
    },
    tailwindcss: {
      config: 'tailwind.config.js'
    }
  },
  rules: {
    ...require('./index.js').rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/enforces-shorthand': 'error'
  }
};