---
title: 条件
categories:
- tutorial
---


s-if
------

通过 **s-if** 指令，我们可以为元素指定条件。当条件成立时元素可见，当条件不成立时元素不存在。

`提示`：当不满足条件时，San 会将元素从当前页面中移除，而不是隐藏。

```html
<span s-if="isOK">Hello San!</span>
```

**s-if** 指令的值可以是任何类型的[表达式](../data-binding/#表达式)。

```html
<span s-if="isReady && isActive">Hello San!</span>
```

`提示`：San 的条件判断不是严格的 === false。所以，一切 JavaScript 的假值都会认为条件不成立：0、空字符串、null、undefined、NaN等。

s-elif
------

`> 3.2.3`

**s-elif** 指令可以给 **s-if** 增加一个额外条件分支块。**s-elif** 指令的值可以是任何类型的[表达式](../data-binding/#表达式)。

```html
<span s-if="isActive">Active</span>
<span s-elif="isOnline">Pending</span>
```

`提示`：**s-elif** 指令元素必须跟在 **s-if** 或 **s-elif** 指令元素后，否则将抛出 **elif not match if** 的异常。


s-else-if
------

`> 3.5.6`

**s-else-if** 指令是 **s-elif** 指令的别名，效果相同。

```html
<span s-if="isActive">Active</span>
<span s-else-if="isOnline">Pending</span>
```


s-else
------

**s-else** 指令可以给 **s-if** 增加一个不满足条件的分支块。**s-else** 指令没有值。

```html
<span s-if="isOnline">Hello!</span>
<span s-else>Offline</span>
```

`提示`：**s-else** 指令元素必须跟在 **s-if** 或 **s-elif** 指令元素后，否则将抛出 **else not match if** 的异常。


虚拟元素
------

在 san 中，template 元素在渲染时不会包含自身，只会渲染其内容。对 template 元素应用 if 指令能够让多个元素同时根据条件渲染视图，可以省掉一层不必要的父元素。

```html
<div>
    <template s-if="num > 10000">
        <h2>biiig</h2>
        <p>{{num}}</p>
    </template>
    <template s-elif="num > 1000">
        <h3>biig</h3>
        <p>{{num}}</p>
    </template>
    <template s-elif="num > 100">
        <h4>big</h4>
        <p>{{num}}</p>
    </template>
    <template s-else>
        <h5>small</h5>
        <p>{{num}}</p>
    </template>
</div>
```

