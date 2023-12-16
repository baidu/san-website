---
title: 模版组件
categories:
- component
---

`版本`：>= 3.12.0

**模板组件**，也叫 **纯视图组件**。有时候我们的组件只具有视图部分，只是为了封装相应的视图结构或样式表达，这时候使用 **模板组件** 可以让运行时更快更轻量。

和普通组件相比， **模板组件** 不支持如下功能：

- 子组件
- filter
- computed
- messages
- 组件事件机制
- attached、inited 等生命周期钩子
- watch、slot、ref 等方法

**模板组件** 仅支持：

- template 指定组件模板
- 在模板中通过 slot 设置插槽
- trimWhitespace、delimiters 等与组件模板相关的设置项
- initData 方法指定初始数据

通过 [defineTemplateComponent](../../doc/main-members/#defineTemplateComponent) 方法，可以创建模板组件。

```javascript
var PanelWithHeader = san.defineTemplateComponent({
    template: '<dl><dt><slot name="header"/></dt><dd><slot/></dd></dl>'
});

var MyApp = san.defineComponent({
    components: {
        'x-panel': PanelWithHeader
    },

    template: '<div><x-panel>'
        + '<b slot="header">{{name}}</b>'
        + '<a>{{desc}}</a>'
        + '</x-panel></div>'
});

var myApp = new MyApp({
    data: {
        name: 'San',
        desc: 'JS Component Framework'
    }
});
myApp.attach(document.body);
```

通过 [native](../../tutorial/event/#native) 修饰符，可以给 **模板组件** 的根元素（如包含）挂载事件。

```javascript
var PanelWithHeader = san.defineTemplateComponent(
    '<dl><dt><slot name="header"/></dt><dd><slot/></dd></dl>'
);

var MyApp = san.defineComponent({
    components: {
        'x-panel': PanelWithHeader
    },

    template: '<div><x-panel on-click="native:clicker">'
        + '<b slot="header">{{name}}</b>'
        + '<a>{{desc}}</a>'
        + '</x-panel></div>',

    clicker: function () {
        console.log('Panel clicked');
    }
});

var myApp = new MyApp({
    data: {
        name: 'San',
        desc: 'JS Component Framework'
    }
});
myApp.attach(document.body);
```
