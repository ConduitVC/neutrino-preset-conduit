# Conduit presets for React and Node.js

`@conduitvc/build` lets you develop, build, and lint React and Node.js
applications with Neutrino-based presets for external tooling.

## Setup

In your project, install the necessary development dependencies:

```sh
# If you are building a React application, also add webpack-dev-server
yarn add --dev webpack webpack-cli neutrino@next eslint @conduitvc/build
```

Next, add a `.neutrinorc.js` file to the root of the project with the following
minimal boilerplate, adding or removing middleware pieces as needed for the
particular project. The setup for each available middleware is outlined below.

```js
module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    // Use available presets here
  ],
};
```

### webpack + React

At a minimum, you need to be able to build and start the React application.
Add the `react` middleware to the `.neutrinorc.js` `use` array:

```js
module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@conduitvc/build/react', {
      flow: true, // Optionally enable flow syntax
      typescript: true, // Optionally enable typescript syntax
      html: {
        title: 'Project Title',
      },
    }],
  ],
};
```

Most middleware allow you to specify an array pair of middleware package and its
options. Above we set the default page title, and any more options that can be
passed relate to the options accepted by
[`@neutrinojs/react`](https://master.neutrinojs.org/packages/react/). 

Next, create a `webpack.config.js` file in the root of the project with the
following code to ensure that Neutrino loads the necessary middleware and sends
it off to webpack:

```js
const neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

You can now start webpack and webpack-dev-server using normal mechanisms,
writing the React application in a `src` directory.

### webpack + Node.js

At a minimum, you need to be able to build and start the Node.js application.
Add the `node` middleware to the `.neutrinorc.js` `use` array:

```js
module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@conduitvc/build/node', {
      flow: true, // Optionally enable flow syntax
      typescript: true, // Optionally enable typescript syntax
    }],
  ],
};
```

Most middleware allow you to specify an array pair of middleware package and its
options. More options that can be passed relate to the options accepted by
[`@neutrinojs/node`](https://master.neutrinojs.org/packages/node/). 

Next, create a `webpack.config.js` file in the root of the project with the
following code to ensure that Neutrino loads the necessary middleware and sends
it off to webpack:

```js
const neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

You can now start webpack using normal mechanisms, writing the Node.js
application in a `src` directory.

### ESLint

To have runtime and build-time linting with ESLint using Conduit rules,
add the relevant Airbnb middleware as the
**first entry in the `.neutrinorc.js` `use` array**.

_Note: Use `airbnb` for React projects, and `airbnb-base` for Node.js projects._

#### React `.neutrinorc.js`

```js
module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@conduitvc/build/airbnb',
    ['@conduitvc/build/react', {
      // ...
    }],
  ],
};
```

#### Node.js `.neutrinorc.js`

```js
module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@conduitvc/build/airbnb-base',
    ['@conduitvc/build/node', {
      // ...
    }],
  ],
};
```

---

Next, create a `.eslintrc.js` file in the root of the project with the
following code to ensure that Neutrino loads the necessary middleware and sends
it off to ESLint:

```js
const neutrino = require('neutrino');

module.exports = neutrino().eslintrc();
```

You can now start webpack, webpack-dev-server, or ESLint using normal
mechanisms, with linting errors and warnings. The following is the recommended
ESLint command to use for one-off lint checks:

```sh
eslint --cache --format codeframe src
```

If you need to override any ESLint rules or settings, pass an array pair
with options according to the
[`@neutrinojs/eslint`](https://master.neutrinojs.org/packages/eslint/),
[`@neutrinojs/airbnb`](https://master.neutrinojs.org/packages/airbnb/),
or [`@neutrinojs/airbnb-base`](https://master.neutrinojs.org/packages/airbnb-base/)
docs.

```js
module.exports = {
  // ...
  use: [
    ['@conduitvc/build/airbnb', {
      eslint: {
        baseConfig: {
          rules: {
            semi: 'error',
          },
        },
      },
    }],
    // ...
  ],
};
```
