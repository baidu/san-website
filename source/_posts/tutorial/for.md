---
title: 循环
categories:
- tutorial
---

通过循环渲染列表是常见的场景。通过在元素上作用 **s-for** 指令，我们可以渲染一个列表。


语法
----

**s-for** 指令的语法形式如下：

```
item-identifier[, index-identifier] in expression[ trackBy accessor-expression]
```

列表渲染
----

下面的代码描述了在元素上作用 **s-for** 指令，渲染一个列表。在列表渲染的元素内部，可以正常访问到 owner 组件上的其他数据（下面例子中的dept）。

```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```

索引
----

**s-for** 指令中可以指定索引变量名（下面例子中的index），从而在列表渲染过程获得列表元素的索引。

```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p, index in persons" title="{{p.name}}">{{index + 1}}. {{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```

列表数据操作
-------

列表数据的增加、删除等操作请使用组件 data 提供的数组方法。详细请参考[数组方法](../data-method/#数组方法)文档。


虚拟元素
------

和 if 指令一样，对 template 元素应用 for 指令，能够让多个元素同时根据遍历渲染，可以省掉一层不必要的父元素。


```html
<!-- Template -->
<dl>
    <template s-for="p in persons">
        <dt>{{p.name}}</dt>
        <dd>{{p.email}}</dd>
    </template>
</dl>
```

trackBy
------

`>= 3.6.1`


在 **s-for** 指令声明中指定 **trackBy**，San 在数组更新时，将自动跟踪项的变更，进行相应的 insert/remove 等操作。 **trackBy** 只能声明 item-identifier 的属性访问。


```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons trackBy p.name" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```


trackBy 通常用在对后端返回的 JSON 数据渲染时。因为前后两次 JSON parse 无法对列表元素进行 === 比对，通过 trackBy， 框架将在内部跟踪变更。结合 transition 时，变更过程的动画效果将更符合常理。

在下面的场景下，使用 trackBy 的性能上反而会变差：

- 所有数据项都发生变化
- 数据项变化前后的顺序不同




