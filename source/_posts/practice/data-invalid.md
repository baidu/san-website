---
title: 什么东西不要保存在 data 里？
categories:
- practice
---

我们知道，data 里应该存与视图相关的数据状态。我们在下面列举了一些不当的使用场景，这些场景是我们不止发现过一次的。

#### 函数

不要把函数作为数据存放。函数应该是独立的，或者作为组件方法存在。

```javascript
// bad
this.data.set('camel2kebab', function (source) {
    return source.replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    });
});
```

#### DOM 对象

这个应该不用解释吧。

```javascript
// bad
this.data.set('sideEl', document.querySelector('sidebar'));
```

#### 组件等复杂对象

不要使用数据来做动态子组件的管理。动态子组件对象可以直接存在组件的成员中。

```javascript
// bad
var layer = new Layer();
layer.attach(document.body);
this.data.set('layer', layer);

// good
var layer = new Layer();
layer.attach(document.body);
this.layer = layer;
```
