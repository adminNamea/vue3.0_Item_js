
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  rules: {
    'guard-for-in': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'indent': 'off',
    'no-nested-ternary': 'off',
    'no-unused-expressions': 'off',
    'no-plusplus': 'off',
    'implicit-arrow-linebreak': 'off',
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'global-require': 'off',
    'vue/no-mutating-props': 'off',
    'no-param-reassign': 'off',
    'comma-dangle': 'off',
    'operator-linebreak': 'off',
    quotes: 'off',
    camelcase: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};