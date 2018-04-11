---
title: 开始
categories:
- tutorial
---

San，是一个 MVVM 的组件框架。它体积小巧（12.6K），兼容性好（IE6），性能卓越，是一个可靠、可依赖的实现响应式用户界面的解决方案。

San 通过声明式的类 HTML 视图模板，在支持所有原生 HTML 的语法特性外，还支持了数据到视图的绑定指令、业务开发中最常使用的分支、循环指令等，在保持良好的易用性基础上，由框架完成基于字符串的模板解析，并构建出视图层的 [节点关系树](https://github.com/baidu/san/blob/master/doc/anode.md)，通过高性能的视图引擎快速生成 UI 视图。San 中定义的数据会被封装，使得当数据发生有效变更时通知 San 组件，San 组件依赖模板编译阶段生成的[节点关系树](https://github.com/baidu/san/blob/master/doc/anode.md)，确定需要变更的最小视图，进而完成视图的异步更新，保证了视图更新的高效性。

组件是 San 的基本单位，是独立的数据、逻辑、视图的封装单元。从页面角度看，组件是 HTML 元素的扩展；从功能模式角度看，组件是一个 ViewModel。San 组件提供了完整的生命周期，与 WebComponent 的生命周期相符合，组件间是可嵌套的树形关系，完整的支持了组件层级、组件间的通信，方便组件间的数据流转。San 的组件机制，可以有效支撑业务开发上的组件化需求。

San 支持[组件反解](https://baidu.github.io/san/tutorial/reverse/)，以此提供[服务端渲染](https://baidu.github.io/san/tutorial/ssr/)能力，可以解决纯前端渲染导致的响应用户交互时延长、SEO 问题。除此之外，San 还提供了一些周边开源产品，与 San 配合使用，可以帮助开发者快速搭建可维护的大型 SPA 应用。

现在，我们从一些简单的例子，开始了解 San。这些例子可以从[这里](https://github.com/baidu/san/tree/master/example/start)找到。

Hello
-------

```javascript
var MyApp = san.defineComponent({
    template: '<p>Hello {{name}}!</p>',

    initData: function () {
        return {
            name: 'San'
        };
    }
});


var myApp = new MyApp();
myApp.attach(document.body);
```


可以看到，通常情况使用 San 会经过这么几步：

1. 我们先定义了一个 San 的组件，在定义时指定了组件的 **内容模板** 与 **初始数据** 。
2. 初始化组件对象
3. 让组件在相应的地方渲染


`额外提示`：在 JavaScript 中书写 HTML 片段对维护来说是不友好的，我们可以通过 WebPack、AMD plugin、异步请求等方式管理。这里为了例子的简单就写在一起了。


列表渲染
--------

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});

var myApp = new MyApp();
myApp.attach(document.body);
```

上面的例子使用 for 指令对列表进行遍历并输出。这里有个很常用的实践方法：在生命周期 **attached** 中重新灌入数据，使视图刷新。在这里，我们可以发起获取数据的请求，在请求返回后更新数据。


双向绑定
--------

```javascript
var MyApp = san.defineComponent({
    template: ''
        + '<div>'
        +   '<input value="{= name =}" placeholder="please input">'
        +   'Hello {{name}}!'
        + '</div>'
});

var myApp = new MyApp();
myApp.attach(document.body);
```

双向绑定通常出现在用户输入的场景，将用户输入结果自动更新到组件数据。在这个例子中，通过 **{= expression =}** 声明双向绑定，把输入框的 value 与数据项 name 绑定起来。


