---
title: 组件异常
categories:
- component
---

`版本`：>= 3.10.7

当组件本身，或者是它的一个子孙节点发生异常时，会调用该组件的 [error](../../doc/api/#error) 钩子函数，此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含异常来源信息的字符串，比如：

```javascript
var Child = san.defineComponent({
    template: '<h1>test</h1>',
    attached: function () {
        throw new Error('error');
    }
});
var myApp = san.defineComponent({
    template: '<div><x-child /></div>',
    components: {
        'x-child': Child
    },
    error: function (err, instance, info) {
        // some code
    }
});
myApp.attach(myApp);
```

其中，异常来源信息包括：
- `hook:{{ hookName }}`：生命周期钩子里的异常
- `initData`：数据初始化执行异常
- `computed:{{ computedName }}`：计算数据执行异常
- `watch:{{ watchName }}`：数据监听的回调函数执行异常
- `message:{{ messageName }}`：消息处理函数执行异常
- `filter:{{ filterName }}`：过滤器执行异常
- `event:{{ eventName }}`：事件处理函数执行异常
- `transitionCreate`：[动画控制器 Creator](../../tutorial/transition/#动画控制器-Creator) 执行异常
- `transitionEnter`：进入[动画控制器](../../tutorial/transition/#动画控制器)执行异常
- `transitionLeave`：离开[动画控制器](../../tutorial/transition/#动画控制器)执行异常
