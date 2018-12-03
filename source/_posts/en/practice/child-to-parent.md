---
title: Child to Parent Messenging
categories:
- practice
---

San components provide event machenism. By calling [fire](/san/doc/api/#fire) method child component can dispatch a custom event, which will be received by the parent component via the on-"event name" directive or **on** method on the child component instance. That is child to parent component messenging.

#### Usage
```javascript
var childComponent = san.defineComponent({    
    template: `
        <div>
            <button on-click="onClick">change</button>
        </div>
    `,
    
    onClick: function () {
        // Dispatch a child-change event
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
        // event handling
    }

});
```
Note: Two-way data binding can also achieve child to parent messenging. But it's not recommended to notify the parent component using two-way data binding other than use cases like form components.

#### Demo
<p data-height="265" data-theme-id="0" data-slug-hash="wqrGLy" data-default-tab="js,result" data-user="naatgit" data-embed-version="2" data-pen-title="child-to-parent" class="codepen">See the Pen <a href="https://codepen.io/naatgit/pen/wqrGLy/">child-to-parent</a> by funa (<a href="https://codepen.io/naatgit">@naatgit</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
