---
title: 安装
categories:
- tutorial
---

你可以通过任何喜欢或者习惯的方式安装和使用 San。


下载
-----

### 直接下载

从 [下载页面](https://github.com/ecomfe/san/releases) 可以获得最新以及过往版本的下载地址。

### CDN

通过 unpkg，你可以无需下载，直接引用。

开发版本：

```html
<script src="https://unpkg.com/san@latest/dist/san.dev.js"></script>
```

生产版本：

```html
<script src="https://unpkg.com/san@latest"></script>
```

> 建议在开发环境不要用生产版本，开发版本提供了有助于开发的错误提示和警告！

### NPM

在使用 san 来构建大型应用时我们推荐使用 NPM 来安装。通过它能够方便的管理依赖包，以及和社区的各种开发构建工具良好配合，构建你的应用程序。

```shell
# 安装最新版本
$ npm install san
```

使用
-----


### script

在页面上通过 script 标签引用需要的文件是常用的方式。可以引用下载下来的 San，也可以通过 CDN 引用。


```html
<!-- 引用直接下载下来的San -->
<script src="san的目录/dist/san.js"></script>

<!-- 引用通过NPM下载下来的San -->
<script src="node_modules/san/dist/san.js"></script>
```

注意：在引用时，

- 如果页面上没有 AMD 环境，将会在页面上注册全局变量 `san`
- 如果页面上有 AMD 环境，将会注册为模块 `san`


### AMD

将 San 下载下来后，通过 AMD 的方式引用 src 目录下的 main.js，可以获得灵活的模块名和整体编译的好处。但是你可能需要先配置好 packages 或 paths 项。

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

在[这个例子](https://github.com/ecomfe/san/tree/master/example/todos-amd)里，我们可以看到一个通过 AMD 管理模块的项目是怎么引用 San 的。

### ESNext

在支持 ESNext 的环境中，可以直接引用

```
import san from 'san';
```

### San component

一个语法如下的 `.san` 文件，就是一个 `San component`

```html
<template>
    <div class="hello">hello {{msg}}</div>
</template>

<script>
    export default {
        initData: {
            msg: 'world'
        }
    }
</script>

<style>
    .hello {
        color: blue;
    }
</style>
```

在 `webpack` 中可以使用 [san-loader](https://github.com/ecomfe/san-loader)  来加载 `.san` 文件

在 [这个例子](https://github.com/ecomfe/san/tree/master/example/todos-esnext) 里，
我们可以看到如何使用 `San component` 构建一个应用

开发版本 VS 生产版本
----------

在开发中，我们推荐使用 `san.dev.js`(位于 `san/dist/san.dev.js`)。`san.dev.js` 提供了包括 [数据校验](/san/tutorial/data-checking/) 等辅助开发功能。这些辅助开发功能可以帮助你在更轻松、快速地定位和解决问题。

但出于性能考虑，正式的生产环境上需要移除了这些辅助开发功能。在 san 的发布包中提供了构建好的生产版本给大家使用，即 `san.js`(位于 `san/dist/san.js`)。你应当在构建应用的生产版本时使用它。

如果你使用 webpack 进行开发和构建 ，那么你可以通过在 webpack 配置添加 `resolve.alias` 再配合指定 `NODE_ENV` 来解决：

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

最后，你可以通过添加两个 npm scripts 来使用不同的 webpack 配置：

```js
{
    "name": "my-san-app",
    "scripts": {
        "dev": "NODE_ENV=development webpack-dev-server --config webpack.config.js",
        "build": "NODE_ENV=production webpack --config webpack.config.js"
    }
}
```

开始开发：

```sh
npm run dev
```

开始构建：

```sh
npm run build
```
