const airbnb = require('@neutrinojs/airbnb');
const airbnbBase = require('@neutrinojs/airbnb-base');
const compileLoader = require('@neutrinojs/compile-loader');
const node = require('@neutrinojs/node');
const react = require('@neutrinojs/react');
const merge = require('deepmerge');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, options = {}) => {
  const airbnbOptions = merge({
    eslint: {
      baseConfig: {
        extends: ['eslint-config-prettier']
      },
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
        'prettier/prettier': ['error', {
          singleQuote: true,
          bracketSpacing: true,
          jsxBracketSameLine: true,
          trailingComma: 'es5',
        }],
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
          { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
          { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
          { blankLine: 'always', prev: '*', next: ['if', 'do', 'for', 'switch', 'try', 'while'] },
          { blankLine: 'always', prev: '*', next: 'return' }
        ],
      }
    }
  }, options.airbnb || {});

  if (options.node) {
    neutrino.use(airbnbBase, airbnbOptions);
    neutrino.use(node, options.node === true ? {} : options.node);
  } else {
    neutrino.use(airbnb, merge(airbnbOptions, {
      eslint: {
        rules: {
          // great idea but it's not smart enough to detect ids in all cases.
          'jsx-a11y/label-has-for': 'off',
          'jsx-a11y/click-events-have-key-events': 'off',
          'jsx-a11y/no-noninteractive-element-interactions': 'off',
          'jsx-a11y/no-static-element-interactions': 'off',
          // handled by prettier rules
          'react/default-props-match-prop-types': 'off',
          'react/jsx-closing-bracket-location': 'off',
          'react/jsx-indent': 'off',
          // styling choice which makes using redux in es6 style more difficult.
          'react/no-multi-comp': 'off',
          'react/prefer-stateless-function': 'off',
          // we have not annotated anything in prop-types
          'react/prop-types': 'off',
          'react/sort-comp': 'off',
        }
      }
    }));
    neutrino.use(react, options.react);
  }

  // Decorators generally need to be enabled *before* other
  // syntax which exists in both normal plugins, and
  // development environment plugins.
  // Tap into the existing Babel options and merge our
  // decorator options *before* the rest of the existing
  // Babel options
  neutrino.config.module
    .rule('compile')
      .use('babel')
        .tap(options => compileLoader.merge({
          plugins: [
            require.resolve('babel-plugin-transform-decorators-legacy'),
            require.resolve('babel-plugin-transform-class-properties')
          ]
        }, options));

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);

  neutrino.config
    .when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('cheap-module-source-map');
    });

  neutrino.register(
    'prettierrc',
    () => neutrino.call('eslintrc').rules['prettier/prettier'][1],
    'Return an object of accumulated prettier ESLint configuration suitable for use by .prettierrc.js'
  );
};
