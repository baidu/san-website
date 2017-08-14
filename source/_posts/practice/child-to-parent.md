---
title: 子组件如何通知父组件？
categories:
- practice
---

子组件可以通过调用[fire](https://ecomfe.github.io/san/doc/api/#fire)方法派发一个自定义事件通知父组件它内部的变化，父组件在视图模板中通过on-的方式或通过组件实例的on方法监听相应的自定义事件。

#### 使用
```javascript
var childComponent = san.defineComponent({
    initData: function () {
        return {
            val: ''
        };
    },
    
    template: `
        <div>
            <button on-click="onClick">change</button>
            <p>{{val}}</p>
        </div>
    `,
    
    onClick: function () {
        // 向父组件派发一个child-change事件
        this.fire('child-change', '12345');
    }
});

var parentComponent = san.defineComponent({
    initData: function () {
        return {
            val: '123'
        };
    },

    components: {
      'my-child': 'childComponent'
    },
  
    template: `
        <div>
            <my-child val="{{val}}" on-child-change="changeHandler($event)" />
        </div>
    `,
  
    changeHandler: function (changedVal) {
        // 事件处理
        this.data.set('val', changedVal);
    }

});
```
我们知道使用「双向绑定」可以将子组件内部的数据变化同步给父组件，但除了类表单组件外，其它情况不建议使用这种方式来达到通知父组件的目的。

#### 示例
<p data-height="265" data-theme-id="0" data-slug-hash="wqrGLy" data-default-tab="result" data-user="naatgit" data-embed-version="2" data-pen-title="child-to-parent" class="codepen">See the Pen <a href="https://codepen.io/naatgit/pen/wqrGLy/">child-to-parent</a> by funa (<a href="https://codepen.io/naatgit">@naatgit</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
