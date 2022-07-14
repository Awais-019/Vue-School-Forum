module.exports = {
  root: true,

  env: {
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  rules: {
    'single-quotes': ['off', 'always'],
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ]
}
