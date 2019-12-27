---
title: 服务端渲染
categories:
- tutorial
---

> 从 3.8.0 开始，san 的服务器端渲染由 [san-ssr][san-ssr] 实现。如果你在使用 3.8.0 之前的 san，请参考 [服务器端渲染（3.8.0 之前）](../ssr-before-3.8/)。

San 的服务端渲染支持是基于 [组件反解](../reverse/) 的：

- 服务端输出的 HTML 中带有对视图无影响，能帮助组件了解数据与视图结构的标记片段
- 浏览器端，组件初始化时从标记片段理解组件结构，在后续用户操作时组件能正确响应，发挥作用

`提示`：由于组件运行环境需要考虑浏览器各版本和 NodeJS，示例代码为保证简单无需 transform，全部采用 ES5 编写。

是否需要 SSR
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


输出 HTML
----

```javascript
const { defineComponent } = require('san');
const { compileToRenderer } = require('san-ssr');
const MyComponent = defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});
const render = compileToRenderer(MyComponent);

console.log(render({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
}));
// Outputs:
// <a><!--s-data:{"email":"errorrik@gmail.com","name":"errorrik"}--><span title="errorrik@gmail.com">errorrik</span></a>
```

san-ssr 提供了 **compileToRenderer** 方法。该方法接收组件的类作为参数，编译返回一个 **{string}render({Object} data)** 方法。 **render** 方法接收数据，返回组件渲染后的 HTML 字符串。


输出 CommonJS 模块
----

有时候，我们希望组件编译的 render 方法是一个单独的 NodeJS Module，以便于其他模块引用它。通过 san-ssr 提供的 **compileToSource** 方法我们可以编译 NodeJS Module。

```javascript
const { defineComponent } = require('san');
const { compileToSource } = require('san-ssr');
const { writeFileSync } = require('fs');
const MyComponent = defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});
const fnBody = compileToSource(MyComponent);
writeFileSync('ssr.js', 'exports = module.exports = ' + fnBody);
```

**compileToSource** 方法接收组件的类作为参数，编译返回组件 render 的 source code，具体为 `function (data) {...}` 形式的字符串。我们只需要在前面增加 `exports = module.exports = `，并写入 **.js** 文件中，就能得到一个符合 CommonJS 标准的 NodeJS Module。


从文件编译到文件
----

在编写编译工具时我们对 san-ssr 有更多需求，比如以文件作为输入，文件作为输出；支持 TypeScript 等。以下是以 TypeScript 文件作为输入，CommonJS 作为输出的示例。

组件代码（一个 `NameComponent` 组件）：

```typescript
import { Component } from 'san'

export default class NameComponent extends Component {
    public static template = '<a><span title="{{email}}">{{name}}</span></a>'
}
```

编译代码（产出 CommonJS 的渲染函数）：

```typescript
import { SanProject } from 'san-ssr'
import { writeFileSync } from 'fs'

const project = new SanProject()
const targetCode = project.compile('./name.comp.ts')

writeFileSync('name.ssr.js', targetCode)
```

使用渲染函数：

```typescript
import nameRenderer = require('./name.ssr')

console.log(nameRenderer({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
}))
// Outputs:
// <a><!--s-data:{"email":"errorrik@gmail.com","name":"errorrik"}--><span title="errorrik@gmail.com">errorrik</span></a>
```

命令行工具
----

san-ssr 提供了命令行接口，可以局部安装在 node_modules 下供 npm scripts 使用，也可以把它安装到全局：

```bash
npm install -g san-ssr
```

编译上述 `NameComponent` 组件：

```bash
san-ssr ./name.comp.ts > name.ssr.js
```

更多 SSR 的指南和 API 请参考：

* README：https://github.com/baidu/san-ssr
* TypeDoc: https://baidu.github.com/san-ssr

[san-ssr]: https://github.com/baidu/san-ssr
