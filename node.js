const node = require('@neutrinojs/node');
const compileLoader = require('@neutrinojs/compile-loader');
const merge = require('deepmerge');

module.exports = (neutrino, { babel = {}, ...opts } = {}) => {
  const presets = [];

  if (opts.typescript) {
    presets.push(require.resolve('@babel/preset-typescript'));
  } else if (opts.flow) {
    presets.push(require.resolve('@babel/preset-flow'));
  }

  const options = merge({
    // Decorators generally need to be enabled *before* other syntax
    babel: compileLoader.merge({
      plugins: [
        [require.resolve('@babel/plugin-proposal-decorators'), {
          legacy: true,
          decoratorsBeforeExport: true,
        }],
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      ],
      presets,
    }, babel),
  }, opts);

  neutrino.use(node, options);
};
