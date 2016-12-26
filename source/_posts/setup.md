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
<!-- 引用直接下载下来的San-->
<script src="san的目录/dist/san.js"></script>

<!-- 引用通过NPM下载下来的San-->
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

还在写哦，我们会赶快写完的......

