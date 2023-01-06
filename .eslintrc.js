const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'jsx-a11y/no-autofocus': 0,
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
