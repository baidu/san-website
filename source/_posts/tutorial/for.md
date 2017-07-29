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
item-identifier[, index-identifier] in expression
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

