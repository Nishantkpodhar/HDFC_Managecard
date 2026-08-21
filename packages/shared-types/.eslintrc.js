module.exports = {
  root: true,
  extends: ['@banking360/eslint-config'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.turbo/'],
};