const loaderMerge = require('@neutrinojs/loader-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (neutrino) => {
  neutrino.use(loaderMerge('lint', 'eslint'), {
    rules: {
      'react/jsx-filename-extension': ['error', {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }],
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  });

  const babel = neutrino.config.module.rule('compile').use('babel');
  const babelOptions = babel.get('options');
  const babelLoader = babel.get('loader');

  neutrino.config.module
    .rule('typescript')
      .test(/\.tsx?$/)
      .use('babel')
        .loader(babelLoader)
        .options(babelOptions)
        .end()
      .use('ts')
        .loader(require.resolve('ts-loader'))
        .options({
          compilerOptions: {
            sourceMap: true,
          },
        });

  neutrino.config
    .plugin('fork-ts')
      .use(ForkTsCheckerWebpackPlugin, [{
        checkSyntacticErrors: true,
        formatter: 'codeframe',
      }]);
};
