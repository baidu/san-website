---
title: 安装
categories:
- tutorial
---

你可以通过任何喜欢或者习惯的方式安装和使用 San。


下载
-----


### 直接下载

从[下载页面](https://github.com/ecomfe/san/releases) 可以获得最新以及过往版本的下载地址。


### CDN

通过 unpkg，你可以无需下载，直接引用。

```html
<script src="https://unpkg.com/san@latest"></script>
```


### NPM

NPM 是流行的包管理工具，通过它能够方便的管理依赖包，以及和社区的各种开发构建工具良好配合，构建你的应用程序。

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
            location: 'san-path/src'
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
        data: {
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

### 使用 San 的 dev 版本

san 的 dev 版本中提供了 [数据校验](/san/tutorial/data-checking/) 、 [DevTool](/san/tutorial/dev-tool/) 等功能，能帮助你在更轻松、快速地开发。

但出于性能考虑，在生产模式上移除了这些功能。 因此，在不同的应用场景你应该使用正确版本的 san。

下面以 `webpack` 举例：

1. 开发环境上你不需要做任何特殊处理；此时你默认使用 `san.all.js`，也就是拥有完全功能支持。
2. 在构建生产脚本时，你需要使用 `resolve.alias` 将 san 指定为生产版本。

    ```js
    // webpack config
    module.exports = {
        resolve: {
            // 使用针对于 spa 应用的发布版本
            san: 'san/dist/san.spa.js'
        }
    };
    ```

    具体的 san 的多个发布版本的区别与说明请参考[这里](https://github.com/ecomfe/san/tree/master/dist)
