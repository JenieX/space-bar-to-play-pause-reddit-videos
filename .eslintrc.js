module.exports = {
  env: {
    browser: !0,
    es2021: !0,
  },
  extends: [
    //
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    GM_xmlhttpRequest: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'func-names': 'off',
    camelcase: ['error', { allow: ['GM_xmlhttpRequest'] }],
  },
};
