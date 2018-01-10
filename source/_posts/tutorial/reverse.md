---
title: 组件反解
categories:
- tutorial
---


**3.4.0 对组件反解机制做了全面的升级。新的组件反解基于数据和模板匹配的机制，代替原来的标记机制。**

旧的基于标记的组件反解请见[老文档](../reverse-flag/)


`版本`：>= 3.4.0


`提示`：通过 San 进行[服务端渲染](../ssr/)，一定能通过相同版本的 San 在浏览器端进行反解。


概述
----

组件初始化时传入 **el**，其将作为组件根元素，并以此反解析出视图结构。

该特性的意图是：有时我们为了首屏时间，期望初始的视图是直接的 HTML，不由组件渲染。但是我们希望组件为我们管理数据、逻辑与视图，后续的用户交互行为与视图变换通过组件管理。

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap').firstChild
});
```

以 **el** 初始化组件时，San 会尊重 **el** 的现时 HTML 形态，不会执行任何额外影响视觉的渲染动作。

- 不会使用预设的 template 渲染视图
- 不会创建根元素
- 直接到达 compiled、created、attached 生命周期




数据
----

组件的视图是数据的呈现。我们需要通过在组件起始时标记 **data**，以指定正确的初始数据。初始数据标记是一个 **s-data:** 开头的 HTML Comment，在其中声明数据。


`警告`：San 的组件反解过程基于数据和组件模板进行视图结构反推与匹配。反解的组件必须拥有正确的标记数据，否则反解过程会发生错误。比如对于模板中的 s-if 条件进行视图反推，如果没有正确的标记数据，反推就会因为元素对应不上，得到不期望的结果。


```html
<a id="wrap"><!--s-data:{
        email: 'error@gmail.com',
        name: 'errorrik'}-->
    <span title="errorrik@gmail.com">errorrik</span>
</a>
```

```javascript
var MyComponent = san.defineComponent({
    template: ''
        + '<a>\n'
        + '    <span title="{{email}}">{{name}}</span>\n'
        + '</a>'
});

var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```



如果一个组件拥有 owner，不用标记初始数据。其初始数据由 owner 根据绑定关系灌入。


```html
<!-- ui-label 组件拥有 owner，无需进行初始数据标记 -->
<div id="main"><!--s-data:{"name":"errorrik"}-->
    <span>errorrik</span>
</div>
```

```javascript
var Label = san.defineComponent({
    template: '<span>{{text}}</span>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: ''
        + '<div>\n'
        + '    <ui-label text="{{name}}"></ui-label>\n'
        + '</div>'
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```


复合插值文本
----

San 支持在插值文本中直接输出 HTML，此时插值文本对应的不是一个 TextNode，而可能是多个不同类型的元素。对于这种复合插值文本，需要在内容的前后各添加一个注释做标记。

- 文本前的注释内容为 **s-text**，代表插值文本片段开始。
- 文本后的注释内容为 **/s-text**，代表插值文本片段结束。

```html
<a id="wrap"><!--s-data:{
        name: 'new <b>San</b>'}-->
    <span>Hello <!--s-text-->new <b>San</b><!--/s-text-->!</span>
</a>
```

```javascript
var MyComponent = san.defineComponent({
    template: ''
        + '<a>\n'
        + '    <span>Hello {{name|raw}}!</span>\n'
        + '</a>'
});

var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```
