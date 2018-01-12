const compileLoader = require('@neutrinojs/compile-loader');
const loaderMerge = require('@neutrinojs/loader-merge');
const FlowPlugin = require('./FlowPlugin');

module.exports = (neutrino) => {
  neutrino.use(loaderMerge('lint', 'eslint'), {
    baseConfig: {
      extends: ['plugin:flowtype/recommended'],
    },
    plugins: ['flowtype'],
  });

  neutrino.config.module
    .rule('compile')
      .use('babel')
        .tap(options => compileLoader.merge(options, {
          plugins: [
            require.resolve('babel-plugin-transform-flow-comments')
          ]
        }));

  neutrino.config
    .plugin('flow')
      .use(FlowPlugin);
};
