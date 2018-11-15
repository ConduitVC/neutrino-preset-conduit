module.exports = {
  eslint: {
    baseConfig: {
      extends: ['eslint-config-prettier'],
      plugins: ['eslint-plugin-prettier'],
      rules: {
        'arrow-body-style': 'off',
        'babel/new-cap': 'off',
        // good stylistic choice but difficult to convert everything.
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        // perhaps needed when iterating over dom, etc.
        'guard-for-in': 'off',
        // specifically makes annotating functions with flow more difficult.
        'function-paren-newline': 'off',
        // perhaps revisit. There are reasons to use and also not use default exports.
        'import/prefer-default-export': 'off',
        'no-continue': 'off',
        'no-mixed-operators': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': 'off',
        'no-return-assign': 'off',
        'no-shadow': 'off',
        'no-unused-expressions': 'off',
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            bracketSpacing: true,
            jsxBracketSameLine: true,
            trailingComma: 'es5',
          },
          { usePrettierrc: false },
        ],
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
          { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
          { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
          { blankLine: 'always', prev: '*', next: ['if', 'do', 'for', 'switch', 'try', 'while'] },
          { blankLine: 'always', prev: '*', next: 'return' },
        ],
      },
    },
  },
};
