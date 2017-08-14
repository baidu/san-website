---
title: 子组件如何通知父组件？
categories:
- practice
---

子组件可以通过调用[fire](https://ecomfe.github.io/san/doc/api/#fire)方法派发一个自定义事件通知父组件它内部的变化，父组件在视图模板中通过on-的方式或通过组件实例的on方法对事件进行监听。

#### 使用
```javascript
var childComponent = san.defineComponent({    
    template: `
        <div>
            <button on-click="onClick">change</button>
        </div>
    `,
    
    onClick: function () {
        // 向父组件派发一个child-change事件
        this.fire('child-change', 'from child');
    }
});

var parentComponent = san.defineComponent({
    components: {
      'my-child': 'childComponent'
    },
  
    template: `
        <div>
            <my-child on-child-change="changeHandler($event)"/>
        </div>
    `,
  
    changeHandler: function (val) {
        // 事件处理
    }

});
```
说明: 我们知道使用「双向绑定」可以将子组件内部的数据变化同步给父组件，但除了类表单组件外，其它情况不建议使用「双向绑定」的方式来达到通知父组件的目的。

#### 示例
<p data-height="265" data-theme-id="0" data-slug-hash="wqrGLy" data-default-tab="result" data-user="naatgit" data-embed-version="2" data-pen-title="child-to-parent" class="codepen">See the Pen <a href="https://codepen.io/naatgit/pen/wqrGLy/">child-to-parent</a> by funa (<a href="https://codepen.io/naatgit">@naatgit</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
