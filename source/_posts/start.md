---
title: 开始
categories:
- tutorial
---


San 是一个 MVVM 的组件框架，通过 San 的视图引擎能够让用户只用操作数据，视图自动更新。

我们以一些简单的例子，开始了解 San。这些例子可以从[这里](https://github.com/ecomfe/san-core/tree/master/example/start)找到。


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


可以看到，通常情况实用 San 会经过这么几步：

1. 我们先定义了一个 San 的组件，在定义时指定了组件的 **内容模板** 与 **初始数据** 。
2. 初始化组件对象
3. 让组件在相应的地方渲染


`额外提示`：在 JavaScript 中书写 HTML 片段对维护来说是不友好的，我们可以通过 WebPack、AMD plugin、异步请求等方式管理。这里为了例子的简单就写在一起了。


列表渲染
--------

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li san-for="item in list">{{item}}</li></ul>',

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
        +   '<input bindx-value="name" placeholder="please input">'
        +   'Hello {{name}}!'
        + '</div>'
});

var myApp = new MyApp();
myApp.attach(document.body);
```

双向绑定通常出现在用户输入的场景，将用户输入结果自动更新到组件数据。在这个例子中，通过 **bindx-** 声明双向绑定，把输入框的 value 与数据项 name 绑定起来。


