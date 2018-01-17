# Conduit Neutrino React & Node.js Preset

`neutrino-preset-conduit` is a Neutrino preset that supports building React or Node.js applications using common
configuration and ESLint rules adapted from Airbnb.

## Features

- Zero upfront configuration necessary to start developing and building a React or Node.js project
- Hot Module Replacement with source-watching during development
- Tree-shaking to create smaller bundles
- Production-optimized bundles with Babel minification, easy chunking, and scope-hoisted modules for faster execution
- Easily extensible to customize your project as needed
- Can build Flow and Typescript projects as well
  - Add `neutrino-preset-conduit/flow` for Flowtype, and add a blank `.flowconfig` to start
  - Add `neutrino-preset-conduit/typescript` for Typescript, and add the following `tsconfig.json` to start:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "target": "es2016"
  }
}
```

### React Features

- Modern Babel compilation adding JSX, object rest spread syntax, class properties, and decorators.
- Extends from [@neutrinojs/react](https://neutrino.js.org/packages/react)
  - Support for React Hot Loader
  - Write JSX in .js or .jsx files
  - Automatic import of `React.createElement`, no need to import `react` or `React.createElement` yourself
- Extends from [@neutrinojs/web](https://neutrino.js.org/packages/web)
  - Modern Babel compilation supporting ES modules, last 2 major browser versions, async functions, and dynamic imports
  - webpack loaders for importing HTML, CSS, images, icons, fonts, and web workers
  - webpack Dev Server during development
  - Automatic creation of HTML pages, no templating necessary
  - Automatic stylesheet extraction; importing stylesheets into modules creates bundled external stylesheets
  - Pre-configured to support CSS Modules via `*.module.css` file extensions
  - Hot Module Replacement support including CSS

### Node.js Features

- Modern Babel compilation supporting ES modules, Node.js 6.10+, async functions, and dynamic imports
- Supports automatically-wired sourcemaps

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

If you are writing a React app, be sure to also install `react` and `react-dom` for actual React development.
You will need to install `neutrino` as well to build the project using the preset.

#### Yarn

```bash
❯ yarn add --dev neutrino neutrino-preset-conduit

# If creating a React app:
❯ yarn add react react-dom
```

#### npm

```bash
❯ npm install --save-dev neutrino neutrino-preset-conduit

# If creating a React app:
❯ npm install --save react react-dom
```

## Project Layout

`neutrino-preset-conduit` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by
Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to import your compiled project.

### React usage

After installing Neutrino and the Conduit preset, add a new directory named `src` in the root of the project, with
a single JS file named `index.js` in it.

```bash
❯ mkdir src && touch src/index.js
```

This preset exposes an element in the page with an ID of `root` to which you can mount your application. Edit
your `src/index.js` file with the following:

```jsx
import { render } from 'react-dom';

render(<h1>Hello world!</h1>, document.getElementById('root'));
```

Now edit your project's package.json to add commands for starting, building, and linting the application:

```json
{
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build",
    "lint": "neutrino lint"
  }
}
```

Add a file called `.neutrinorc.js` to the root of the repo, add this preset to your use array:

```js
module.exports = {
  use: [
    'neutrino-preset-conduit'
  ]
};
```

By default this preset builds a React app with no settings configured. If you want to switch to Node.js,
pass `true` or Node.js preset options object to the Conduit preset using an array pair:

```js
module.exports = {
  use: [
    ['neutrino-preset-conduit', {
      node: true
    }]
  ]
};
```

Start the app, then open a browser to the address in the console:

#### Yarn

```bash
❯ yarn start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

#### npm

```bash
❯ npm start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

## Building

`neutrino-preset-conduit` builds static assets to the `build` directory by default when running `neutrino build`. Using
the quick start example above as a reference:

```bash
❯ yarn build

✔ Building project completed
Hash: b26ff013b5a2d5f7b824
Version: webpack 3.5.6
Time: 9773ms
                           Asset       Size    Chunks             Chunk Names
   index.dfbad882ab3d86bfd747.js     181 kB     index  [emitted]  index
 runtime.3d9f9d2453f192a2b10f.js    1.51 kB   runtime  [emitted]  runtime
                      index.html  846 bytes            [emitted]
✨  Done in 14.62s.
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place
them in a directory within `src` called `static`. All files in this directory will be copied from `src/static`
to `build/static`. To change this behavior, specify your own patterns with
[@neutrinojs/copy](https://neutrino.js.org/packages/copy).

## React Paths

The `@neutrinojs/web` preset loads assets relative to the path of your application by setting webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify React preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the preset and override its options. See the
[Web documentation](https://neutrino.js.org/packages/web#preset-options) for specific options you can override with this object.

```js
module.exports = {
  use: [
    ['neutrino-preset-conduit', {
      // Preset options.

      // Override the "react" object to configure react preset
      react: {
        // Example: disable Hot Module Replacement
        hot: false,
  
        // Example: change the page title
        html: {
          title: 'Epic React App'
        },
  
        // Target specific browsers with babel-preset-env
        targets: {
          browsers: [
            'last 1 Chrome versions',
            'last 1 Firefox versions'
          ]
        },
  
        // Add additional Babel plugins, presets, or env options
        babel: {
          // Override options for babel-preset-env:
          presets: [
            ['babel-preset-env', {
              modules: false,
              useBuiltIns: true,
              exclude: ['transform-regenerator', 'transform-async-to-generator'],
            }]
          ]
        }
      },

      // Override the "node" object to configure node preset
      node: {
        // Enables Hot Module Replacement. Set to false to disable
        hot: true,
  
        polyfills: {
          // Enables fast-async polyfill. Set to false to disable
          async: true
        },
  
        // Target specific versions via babel-preset-env
        targets: {
          node: '6.10'
        },
  
        // Remove the contents of the output directory prior to building.
        // Set to false to disable cleaning this directory
        clean: {
          paths: [neutrino.options.output]
        },
  
        // Add additional Babel plugins, presets, or env options
        babel: {
          // Override options for babel-preset-env, showing defaults:
          presets: [
            ['babel-preset-env', {
              targets: { node: '6.10' },
              modules: false,
              useBuiltIns: true,
              // These are excluded when using polyfills.async. Disabling the async polyfill
              // will remove these from the exclusion list
              exclude: ['transform-regenerator', 'transform-async-to-generator']
            }]
          ]
        }
      },

      // Override the "airbnb" object to configure linting preset
      airbnb: {
        eslint: {
          rules: {
            // ...
          }
        }
      }
    }]
  ]
};
```

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-conduit` does not use any additional named rules, loaders, or plugins that aren't already in use by the
Web, React, Node.js, and Airbnb presets. See each other preset for specifics on configuring or overriding those values.

For details on merging and overriding Babel configuration, such as supporting other syntax, read more
about using the [`compile-loader` `merge`](https://neutrino.js.org/packages/compile-loader#advanced-merging) once you
are comfortable customizing your build.

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule, loader, and
plugin IDs from the extended base presets, you can override and augment the build by providing a function to your
`.neutrinorc.js` use array. You can also make these changes from the Neutrino API in custom middleware.

By default Neutrino, and therefore this preset, creates a single **main** `index` entry point to your application, and
this maps to the `index.*` file in the `src` directory. The extension is resolved by webpack. This value is provided by
`neutrino.options.mains` at `neutrino.options.mains.index`. This means that the Web preset is optimized toward the use
case of single-page applications over multi-page applications. If you wish to output multiple pages, you can detail
all your mains in your `.neutrinorc.js`.

```js
module.exports = {
  options: {
    mains: {
      index: 'index', // outputs index.html from src/index.*
      admin: 'admin', // outputs admin.html from src/admin.*
      account: 'user' // outputs account.html from src/user.*
    }
  },
  use: ['neutrino-preset-conduit']
}
```

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put React and React DOM into a separate "vendor" chunk:_

```js
module.exports = {
  use: [
    ['neutrino-preset-conduit', {
      // ...
    }],
    (neutrino) => {
      neutrino.config
        .entry('vendor')
          .add('react')
          .add('react-dom');
    }
  ]
};
```

## Hot Module Replacement

While `neutrino-preset-conduit` supports Hot Module Replacement in your app, it does require some
application-specific changes in order to operate.

### React

First, install `react-hot-loader` as a dependency, this **must** be React Hot Loader v4+, which is in beta:

#### Yarn

```bash
❯ yarn add react-hot-loader
```

#### npm

```bash
❯ npm install --save react-hot-loader
```

---

Follow the instructions for React Hot Loader, skipping the `babelrc` step as this is already
handled for you by Neutrino:

https://github.com/gaearon/react-hot-loader/tree/next#getting-started

You will follow the step to "mark your root component as _hot-exported_":

```js
// ./src/App/index.jsx
import { Component } from 'react';
import { hot } from 'react-hot-loader';

class App extends Component {
  render() {
    return <div>Hello World!</div>;    
  }
}

export default hot(module)(App);
```

That's it!

### Node.js

Your application should define split points for which to accept modules to reload using `module.hot`:

For example:

```js
import { createServer } from 'http';
import app from './app';

if (module.hot) {
  module.hot.accept('./app');
}

createServer((req, res) => {
  res.end(app('example'));  
}).listen(/* */);
```

Or for all paths:

```js
import { createServer } from 'http';
import app from './app';

if (module.hot) {
  module.hot.accept();
}

createServer((req, res) => {
  res.end(app('example'));  
}).listen(/* */);
```

Using dynamic imports with `import()` will automatically create split points and hot replace those modules upon
modification during development.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/react.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/react.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/react
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
