---
title: Setup
categories:
- tutorial
---

San can be installed and used in many ways.


Download
-----

### from Github Releases

Both the latest and history versions are available on [Github Releases](https://github.com/baidu/san/releases).

### from CDN

Skip the download and make use of the **unpkg** CDN:

Development:

```html
<script src="https://unpkg.com/san@latest/dist/san.dev.js"></script>
```

Production:

```html
<script src="https://unpkg.com/san@latest"></script>
```

> Development version is recommended for development environment, it provides many useful error information and warnings!

### NPM

Via NPM is recommended when used to build large-scaled applications.
NPM is a package manager with a large community, which is especially useful when it comes to development tooling.

```shell
# install the latest version
$ npm install san
```

### CLI

San provides an official CLI for quickly scaffolding ambitious projects. It provides out-of-the-box build setup for modern front-end workflows, takes just a few minutes to get a brand new San project up and running, and comes with useful features such as hot reloading, code linting, and build versions available for production environments. It also has a graphical user interface. Details are available in [the San CLI documentation]((https://ecomfe.github.io/san-cli/)).


Usage
-----


### script

It is a common way to load san via a script tag on the page. The `src` URL can be either a CDN location or a local file URL.


```html
<!-- load your local copy -->
<script src="<path to san>/dist/san.js"></script>

<!-- load san from node_modules -->
<script src="node_modules/san/dist/san.js"></script>
```

Note: when san is being loaded,

- In [AMD](https://requirejs.org) environment, a module named `san` will be defined.
- Otherwise, a global variable named `san` will be created.


### AMD

By requiring `src/main.js` directly, you can build san along with your project, thus the module name can be customized.
To do this, you'll need to make sure the [packages](https://requirejs.org/docs/api.html#config-packages) or [paths](https://requirejs.org/docs/api.html#config-paths) are properly configured.

```js
require.config({
    packages: [
        {
            name: 'san',
            location: 'san-path/dist/san'
        }
    ]
});
```

In [this example](https://github.com/baidu/san/tree/master/example/todos-amd), you'll see how to use san in AMD environment.

### ESNext

In ESNext environment, san can be directly imported:

```
import san from 'san';
```

### San Component

A `.san` file with the following content is called a `San component`:

```html
<template>
    <div class="hello">hello {{msg}}</div>
</template>

<script>
    export default {
        initData () {
            return {
                msg: 'world'
            };
        }
    }
</script>

<style>
    .hello {
        color: blue;
    }
</style>
```

There's a [san-loader](https://github.com/ecomfe/san-loader) to load `.san` files in webpack.

In [this example](https://github.com/baidu/san/tree/master/example/todos-esnext), you'll see how to build `San component`s.

Development vs. Production
----------

In development environment, we recommend you to use the `san.dev.js`(located at `san/dist/san.dev.js`).
`san.dev.js` provides facilities such as [data validation](/san/tutorial/data-checking/) to help you identify and solve problems more easily.

For performance considerations, the production build removes these functionalities.
There's a production build in san releases, located at `san/dist/san.js`, which is intended for production usage.

If you're using webpack, development/production modes can be set via `resolve.alias` configuration and a corresponding `NODE_ENV` environment variable:

```js
{
    module: {
        loaders: [
            {
                test: /\.san$/,
                loader: 'san-loader'
            }
        ]
    },
    resolve: {
        alias: {
            san: process.env.NODE_ENV === 'production'
                ? 'san/dist/san.js'
                : 'san/dist/san.dev.js'
        }
    }
}
```

Finally, you can use npm scripts to apply these two webpack configurations:

```js
{
    "name": "my-san-app",
    "scripts": {
        "dev": "NODE_ENV=development webpack-dev-server --config webpack.config.js",
        "build": "NODE_ENV=production webpack --config webpack.config.js"
    }
}
```

For development:

```sh
npm run dev
```

Production building:

```sh
npm run build
```
