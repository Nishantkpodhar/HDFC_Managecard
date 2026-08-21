module.exports = {
  ...require('./index.js'),
  env: {
    ...require('./index.js').env,
    node: true
  },
  parserOptions: {
    ...require('./index.js').parserOptions,
    project: true
  }
};