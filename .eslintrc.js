const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'jsx-a11y/no-autofocus': 0,
  },
};
