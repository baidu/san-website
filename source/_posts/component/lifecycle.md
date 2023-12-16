---
title: 组件生命周期
categories:
- component
---


San 的组件是 HTML 元素扩展的风格，所以其生命周期的命名风格与 WebComponents 相符合。

- `compiled` - 组件视图模板编译完成
- `inited` - 组件实例初始化完成
- `created` - 组件元素创建完成
- `attached` - 组件已被附加到页面中
- `detached` - 组件从页面中移除
- `disposed` - 组件卸载完成

组件的生命周期有这样的一些特点：

- 生命周期代表组件的状态，生命周期本质就是状态管理。
- 在生命周期的不同阶段，组件对应的钩子函数会被触发运行。
- 并存。比如 attached 和 created 等状态是同时并存的。
- 互斥。attached 和 detached 是互斥的，disposed 会互斥掉其它所有的状态。
- 有的时间点并不代表组件状态，只代表某个行为。当行为完成时，钩子函数也会触发。如 **updated** 代表每次数据变化导致的视图变更完成。


通过生命周期的钩子函数，我们可以在生命周期到达时做一些事情。比如在生命周期 **attached** 中发起获取数据的请求，在请求返回后更新数据，使视图刷新。

```javascript
var ListComponent = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: []
        };
    },

    attached: function () {
        requestList().then(this.updateList.bind(this));
    },

    updateList: function (list) {
        this.data.set('list', list);
    }
});
```


下图详细描述了组件的生存过程：

<img src="../../img/life-cycle.png" width="540">