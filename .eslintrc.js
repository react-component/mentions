module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'jsx-a11y/no-autofocus': 0,
    '@typescript-eslint/consistent-indexed-object-style': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-throw-literal': 0,
    '@typescript-eslint/type-annotation-spacing': 0,
    '@typescript-eslint/ban-types': 0,
  },
  overrides: [
    {
      files: ['docs/**/*.tsx'],
      rules: {
        'no-console': 0,
      },
    },
  ],
};
