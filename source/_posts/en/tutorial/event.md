---
title: Event Handling
categories:
- tutorial
---

Events are the most commonly used behavior management methods in development.
Bind the processing of events to the component's methods with the **on-** prefix。

`Hint`: In San, both the DOM event and the component's custom event are bound by the **on-** prefix, with no syntax distinction.


DOM Event
-------

**on- + event name** binds the event of the DOM element to the component method. When a DOM event fires, the component method is called and this points to the component instance. 
In the following example, when the button is clicked, the component's submit method is called.


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

When binding events, you can specify parameters that reference the data in the current rendering environment. The argument can be any type of [expression] (../template/#expression).

```html
<!-- Template -->
<ul>
    <li s-for="item, index in todos">
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

When specifying a parameter, **$event** is a special variable reserved by San, specifying that $event will be referenced to the DOM Event object. 
So you can get event information such as the event-triggered DOM object, mouse position of the mouse event.

```javascript
san.defineComponent({
    template: '<button type="button" on-click="clicker($event)">click here</button>',

    clicker: function (e) {
        alert(e.target.tagName); // BUTTON
    }
});
```




customized event
--------

Custom events for components can be bound by the **on-** prefix on the component.

In the following example, MyComponent binds the done event of Label component with an event handler.

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

San's component architecture provides event functionality, and Label can easily dispatch an event directly by calling the fire method.

```javascript
var Label = san.defineComponent({
    template: '<template class="ui-label" title="{{text}}">{{text}}</template>',

    attached: function () {
        this.fire('done', this.data.get('text') + ' done');
    }
});
```


Modifier
--------

### capture

`Version`：>= 3.3.0

The capture modifier is used in the element's event declaration and the event is bound to the capture phase.

```javascript
var MyComponent = san.defineComponent({
    template: ''
        + '<div on-click="capture:mainClick">'
            + '<button on-click="capture:btnClick">click</button>'
        + '</div>',

    mainClick: function (title) {
        alert('Main');
    },

    btnClick: function (title) {
        alert('Button');
    }
});
```

`Note`: This feature is only supported in browser environments that support **addEventListener**. Using the capture modifier on older IEs will have no effect.

### native

`Version`：>= 3.3.0


Using the native modifier in the component's event declaration, the event is bound to the DOM event of the component's root element.

```javascript
var Button = san.defineComponent({
    template: '<a class="my-button"><slot/></a>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-button': Button
    },

    template: '<div><ui-button on-click="native:clicker(title)">{{title}}</ui-button></div>',

    clicker: function (title) {
        alert(title);
    }
});
```

Sometimes components encapsulate some infrastructure and styles, and hope that DOM events such as clicks and touches are handled by external consumers. 
If the component needs fire each root element DOM event is cumbersome and difficult to maintain. The native modifier solves this problem.


