const { spawnSync } = require('child_process');
const flow = require('flow-bin');
const merge = require('deepmerge');

module.exports = class FlowPlugin {
  constructor(options = {}) {
    this.options = merge({
      warn: false,
      flags: [
        'status',
        '--color=always',
      ],
      ignoreLines: [
        'Please wait',
        'Launching Flow server',
        'Spawned flow server',
        'Logs will go to',
        'Monitor logs will go to',
        'Started a new flow server',
      ],
      formatError(code, details) {
        return `Flow: ${code}\n\n${details}`;
      }
    }, options);
  }

  apply(compiler) {
    compiler.plugin('run', (compiler, next) => this.checkFlowStatus(compiler, next));
    compiler.plugin('watch-run', (compiler, next) => this.checkFlowStatus(compiler, next));
    compiler.plugin('compilation', (compilation) => this.pushError(compilation));
  }

  getErrorCodeForStatus(status) {
    switch (status) {
      case 1: return 'Server Initializing';
      case 2: return 'Type Error';
      case 3: return 'Out of Time';
      case 4: return 'Kill Error';
      case 6: return 'No Server Running';
      case 7: return 'Out of Retries';
      case 8: return 'Invalid Flowconfig';
      case 9: return 'Build Id Mismatch';
      case 10: return 'Input Error';
      case 11: return 'Lock Stolen';
      case 12: return 'Could Not Find Flowconfig';
      case 13: return 'Server Out of Date';
      case 14: return 'Server Client Directory Mismatch';
      case 15: return 'Out of Shared Memory';
    }
  }

  checkFlowStatus(compiler, next) {
    const response = spawnSync(flow, this.options.flags);
    const { status } = response;

    if (status !== 0) {
      const code = this.getErrorCodeForStatus(status);
      const details = this.options.ignoreLines
        .reduce((formatted, ignore) => {
          const replacer = new RegExp(`^${ignore}.*$`, 'gm');

          return formatted.replace(replacer, '');
        }, `${response.stdout.toString()}${response.stderr.toString()}`);

      this.error = new Error(this.options.formatError(code, details));
    }

    next();
  }

  pushError(compilation) {
    if (this.error) {
      this.options.warn ?
        compilation.warnings.push(this.error) :
        compilation.errors.push(this.error);
      this.error = null;
    }
  }
};
