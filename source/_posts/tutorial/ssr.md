---
title: 服务端渲染
categories:
- tutorial
---



San 的服务端渲染支持是基于 [组件反解](../reverse/) 的：

- 服务端输出的 HTML 中带有对视图无影响，能帮助组件了解数据与视图结构的标记片段
- 浏览器端，组件初始化时从标记片段理解组件结构，在后续用户操作时组件能正确响应，发挥作用

`提示`：由于组件运行环境需要考虑浏览器各版本和NodeJS，示例代码为保证简单无需transform，全部采用ES5编写。

是否需要SSR
----

服务端渲染，视图 HTML 直出有一些显而易见的好处：

- SEO 友好，HTML 直接输出对搜索引擎的抓取和理解更有利
- 用户能够第一时间看到内容。从开发者角度来说，首屏时间更快到来

但是，如果使用服务端渲染，我们将面对：

- 更高的成本。虽然我们开发的是一份组件，但我们需要考虑其运行时是 NodeJS 和 浏览器 双端的，我们需要考虑在服务端渲染要提前编译，我们需要考虑组件的源码如何输出到浏览器端，我们需要考虑开发组件的浏览器兼容性，到底要写老旧的浏览器兼容性好的代码还是按ESNext写然后通过打包编译时 transform。这依然带来了维护成本的增加，即使不多
- 用户可交互时间不一定更早到来。交互行为是由组件管理的，组件从当前视图反解出数据和结构需要遍历 DOM 树，反解的时间不一定比在前端直接渲染要快

所以，我们建议，使用服务端渲染时全面评估，只在必须使用的场景下使用。下面是一些场景建议：

- 后台系统（CMS、MIS、DashBoard之类）大多使用 Single Page Application 的模式。显而易见，这类系统不需要使用 SSR
- 功能型页面，不需要使用 SSR。比如个人中心、我的收藏之类
- 仅在 App 的 WebView 中展现，不作为开放 Web 存在的页面，不需要使用 SSR
- 偏重内容型页面，可以使用 SSR。但是组件是管理行为交互的，对内容部分无需进行组件渲染，只需要在有交互的部分进行组件反解渲染


输出HTML
----

```javascript
var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

var render = san.compileToRenderer(MyComponent);
render({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
});
// render html result:
// <a>....</a>
```


San 在主包下提供了 **compileToRenderer** 方法。该方法接收组件的类作为参数，编译返回一个 **{string}render({Object} data)** 方法。 **render** 方法接收数据，返回组件渲染后的 HTML 字符串。


编译NodeJS模块
----

有时候，我们希望组件编译的 render 方法是一个单独的 NodeJS Module，以便于其他模块引用它。通过 San 主包下提供的 **compileToSource** 方法我们可以编译 NodeJS Module。

```javascript
var san = require('san');
var fs = require('fs');

var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

var renderSource = san.compileToSource(MyComponent);
fs.writeFileSync('your-module.js', 'exports = module.exports = ' + renderSource, 'UTF-8');
```

**compileToSource** 方法接收组件的类作为参数，编译返回组件 render 的 source code，具体为 `function (data) {...}` 形式的字符串。我们只需要在前面增加 `exports = module.exports = `，并写入 **.js** 文件中，就能得到一个符合 CommonJS 标准的 NodeJS Module。
