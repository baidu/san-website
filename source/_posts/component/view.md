---
title: 组件视图
categories:
- component
---


## 视图模板

定义组件时，通过 template 可以定义组件的视图模板。


```javascsript
san.defineComponent({
    template: '<div>'
        + '<label><input type="checkbox" value="errorrik" checked="{= online =}">errorrik</label>'
        + '<label><input type="checkbox" value="otakustay" checked="{= online =}">otakustay</label>'
        + '<label><input type="checkbox" value="firede" checked="{= online =}">firede</label>'
        + '</div>',

    initData: function () {
        return {
            online: ['errorrik', 'otakustay']
        };
    }
});
```

通常，将 HTML 片段写在 JavaScript 中是不友好的，我们可以把模板写在单独的文件里，通过工具或装载器去管理。

在 webpack + ESNext 环境下引用模板：

```
待补充
```

在 AMD 环境下通过 text plugin 引用模板：

```javascript
san.defineComponent({
    template: require('text!./template.html'),

    initData: function () {
        return {
            online: ['errorrik', 'otakustay']
        };
    }
});
```

`强调`：San 要求组件对应 **一个** HTML 元素，所以视图模板定义时，只能包含一个 HTML 元素，其它所有内容需要放在这个元素下。

```html
<!-- 正确 -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>

<!-- 错误 -->
<p>name</p>
<p>email</p>
```

组件对应的 HTML 元素可能是由其 **owner** 组件通过视图模板指定的，视图模板不好直接定死对应 HTML 元素的标签。此时可以将视图模板对应的 HTML 元素指定为 **template**。

```html
<template class="ui-timepicker">{{ value | valueText }}</template>
```


## 过滤器

在定义视图模板时，插值是常用的展现数据的方式。在编写插值时，我们常使用 **过滤器** 将数据转换成适合视图展现的形式。

```
{{createTime | dateFormat('yyyy-MM-dd')}}
```

### 内置过滤器


San 针对常用场景，内置了几个过滤器：

- `html` - HTML 转义。当不指定过滤器时，默认使用此过滤器
- `url` - URL 转义
- `raw` - 不进行转义。当不想使用 HTML 转义时，使用此过滤器


### 定制过滤器

通过定义组件的 **filters** 成员，可以指定组件的视图模板可以使用哪些过滤器。

```javascript
san.defineComponent({
    template: '<a>{{createTime | dateFormat("yyyy-MM-dd")}}</a>',

    filters: {
        dateFormat: function (value, format) {
            return moment(value).format(format);
        }
    }
});
```

过滤器函数的第一个参数是表达式对应的数据值，过滤器调用时传入的参数从第二个参数开始接在后面。

`注意`：考虑到组件的独立性，San 没有提供全局过滤器注册的方法，组件要使用的过滤器必须在自身的 **filters** 中定义。


## 插槽

在视图模板中可以通过 slot 声明一个插槽的位置，其位置的内容可以由外层组件定义。具体请参考[插槽](../../tutorial/slot/)文档。

```javascript
var Panel = san.defineComponent({
    template: '<div>'
        + '  <div class="head" on-click="toggle">title</div>'
        + '  <p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
        + '</div>',

    toggle: function () {
        this.data.set('fold', !this.data.get('fold'));
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-panel': Panel
    },

    template: '<div><ui-panel>Hello San</ui-panel></div>'
});

/* MyComponent渲染结果
<div>
  <div class="head">title</div>
  <p style="display:none">Hello San</p>
</div>
*/
```


## el


组件实例的属性 **el** 表示组件对应的 HTML 元素，组件初始化时可以通过 option 传入。

基本上在编写组件时不需要关心它，但是在初始化组件时如果传入 **el**，意味着让组件以此元素作为组件根元素。元素将：

- 不会使用预设的 template 渲染视图
- 不会创建根元素
- 直接到达 compiled、created、attached 生命周期

有时我们为了首屏时间，期望初始的视图是直接的 HTML，不希望初始视图是由组件渲染的。但是我们希望组件为我们管理数据、逻辑与视图，后续的用户交互行为与视图变换通过组件管理，此时就可以通过 **el** 传入一个现有元素。

组件将以 **el** 传入的元素作为组件根元素并反解析出视图结构。这个过程我们称作 **组件反解**。详细请参考[组件反解](../hydrate/)文档。

