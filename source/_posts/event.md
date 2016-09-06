---
title: 事件处理
categories:
- tutorial
---

事件是开发中最常用的行为管理方式。通过 **on-** 前缀，可以将事件的处理绑定到组件的方法上。

`提示`：在 San 中，无论是 DOM 事件还是组件的自定义事件，都通过 **on-** 前缀绑定，没有语法区分。


DOM 事件
-------

**on- + 事件名** 将 DOM 元素的事件绑定到组件方法上。当 DOM 事件触发时，组件方法将被调用，this 指向组件实例。下面的例子中，当按钮被点击时，组件的 submit 方法被调用。


```javascript
san.defineComponent({
    template: '...<button type="button" on-click="submit">submit</button>',

    submit: function () {
        var title = this.data.get('title');
        if (!title) {
            return;
        }

        sendData({title: title});
    }
});
```


绑定事件时，可以指定参数，引用当前渲染环境中的数据。参数可以是任何类型的[表达式](../data-binding/#表达式)。

```html
<!-- Template -->
<ul>
    <li san-for="item, index in todos">
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
        <i class="fa fa-trash-o" on-click="rmTodo(item)"></i>
    </li>
</ul>
```

```javascript
// Component
san.defineComponent({
    rmTodo: function (todo) {
        service.rmTodo(todo.id);
        this.data.remove('todos', todo);
    }
});
```


指定参数时，**$event** 是 San 保留的一个特殊变量，指定 $event 将引用到 DOM Event 对象。从而你可以拿到事件触发的 DOM 对象、鼠标事件的鼠标位置等事件信息。

```javascript
san.defineComponent({
    template: '<button type="button" on-click="clicker($event)">click here</button>',

    clicker: function (e) {
        alert(e.target.tagName); // BUTTON
    }
});
```




自定义事件
--------

在 WebComponents-like 的组件体系下，每个组件具有一个根元素，所以通过 **on- + 事件名** 我们可以为组件的根元素绑定 DOM 事件处理，也可以为组件绑定自定义事件处理。


下面的例子中，MyComponent 为 Label 组件绑定了 done 事件的处理方法。组件事件的绑定语法与 DOM 事件绑定完全相同。

```javascript
var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label bind-text="name" on-done="labelDone($event)"></ui-label></div>',

    labelDone: function (doneMsg) {
        alert(doneMsg);
    }
});
```

San 的组件体系提供了事件功能，Label 直接通过调用 fire 方法就能方便地派发一个事件。

```javascript
var Label = san.defineComponent({
    template: '<template class="ui-label" title="{{text}}">{{text}}</template>',

    attached: function () {
        this.fire('done', this.data.get('text') + ' done');
    }
});
```

`额外提示`：在组件中，由于 **on-** 能绑定组件根元素事件与组件自定义事件，所以组件开发者在设计自定义事件时，事件名不能和 DOM 事件名相同，否则可能导致不可预测的后果。


