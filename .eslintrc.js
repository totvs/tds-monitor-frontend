module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    '@open-wc/eslint-config',
    'eslint-config-prettier',
    'plugin:lit/recommended'
  ],
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
  },
  rules: {
    "indent": [
      "error",
      "tab",
      {
        "SwitchCase": 1
      }
    ],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  }
};
