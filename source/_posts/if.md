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


s-else
------

**s-else** 指令可以给 **s-if** 增加一个不满足条件的分支块。**s-else** 指令没有值。

```html
<span s-if="isOnline">Hello!</span>
<span s-else>Offline</span>
```

`提示`：**s-else** 指令元素必须跟在 **s-if** 指令元素后，否则将抛出 **else not match if** 的异常。
