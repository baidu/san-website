---
title: 样式
categories:
- tutorial
---

样式处理是编写视图模板时常见的场景，涉及到的 attribute 有 class 和 style，它们的处理方式和其他元素 attribute 有一些区别。本文专门描述样式处理上常见的场景。

在开始前，先强调一下：San 并没有为 class 和 style 处理提供特殊的绑定语法，他们的处理与其它 attribute 方式一样。

class
------

我们可能会设计一些用于表示状态的 class，这些 class 是否应该被添加到元素上，取决于某些数据的值。一个简单的场景是下拉列表的收起和展开状态切换。

```html
<!-- template -->
<div>
    <button on-click="toggle"></button>
    <ul class="list{{isHidden ? ' list-hidden' : ''}}">...</ul>
</div>
```

```javascript
// Component
san.defineComponent({
    toggle: function () {
        var isHidden = this.data.get('isHidden');
        this.data.set('isHidden', !isHidden);
    }
});
```

上面的例子中，isHidden 数据为真时，ul 具有 list-hidden 的 class，为假时不具有。

San 在设计时，希望视图模板开发者像写正常的 attribute 一样编写 class 与 style，所以没有提供特殊的绑定语法。通过三元运算符的支持可以处理这样的场景。

下面例子是一个根据状态不同，切换不同 class 的场景。


```html
<ul class="list {{isHidden ? 'list-hidden' : 'list-visible'}}">...</ul>
```

style
-----

对 style 的处理通常没有 class 那么复杂。我们很少会把样式信息写在数据中，但有时我们期望用户能定制一些界面样式，这个时候样式可能来源于数据。

```html
<ul>
    <li
        s-for="item, index in datasource"
        style="background: {{item.color}}"
        class="{{item.id == value ? 'selected' : ''}}"
        on-click="itemClick(index)"
    >{{ item.title }}</li>
</ul>
```

此时需要警惕的是，数据可能并不存在，导致你设置的 style 并不是一个合法的样式。如果你不能保证数据一定有值，需要把样式名包含在插值中。

```html
<ul>
    <li
        s-for="item, index in datasource"
        style="{{item.color ? 'background:' + item.color : ''}}"
        class="{{item.id == value ? 'selected' : ''}}"
        on-click="itemClick(index)"
    >{{ item.title }}</li>
</ul>
```

s-show
-----

`>= 3.9.3`

**s-show** 指令可以通过一个表达式控制元素的 **显示/隐藏**，是 **display** 样式的语法糖。

```html
<span s-show="isActive">Active</span>
```

`提示`：与 **s-if** 不同在于，当使用 **s-show** 并值为 false 时，元素依然在 DOM 树中存在。
