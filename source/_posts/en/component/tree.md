---
title: Component Tree
categories:
- component
---

We know that under the component system, components must be nestable tree relationships. Let's do some explanation from a piece of code below. In the code below, AddForm internally uses two custom components: ui-calendar and ui-timepicker.

```html
<!-- Template -->
<div class="form">
    <input type="text" class="form-title" placeholder="标题" value="{= title =}">
    <textarea class="form-desc" placeholder="备注" value="{= desc =}"></textarea>

    <div>Expected completion time:
        <ui-calendar value="{= endTimeDate =}" s-ref="endDate"></ui-calendar>
        <ui-timepicker value="{= endTimeHour =}" s-ref="endHour"></ui-timepicker>
    </div>

    <div class="form-op">
        <button type="button" on-click="submit">ok</button>
    </div>
</div>
```

```javascript
var AddForm = san.defineComponent({
    // template

    components: {
        'ui-timepicker': require('../ui/TimePicker'),
        'ui-calendar': require('../ui/Calendar')
    },

    submit: function () {
        this.ref('endDate')
        this.ref('endHour')
    }
});
```


## components

Components typically use other components by declaring custom elements.

Which subcomponent types can be used by the component view, which must first be specified by the component's **components** member. In  **components** object, the key is the name of a custom element, and the value is component class.

`tips`：Given the independence of components, San does not provide a way to register global components. Components must declare which components they use internally in their own **components**.

Some components may use themselves in content, such as tree nodes. We can set the value of this item in **components** to a string **self**

```javascript
var Node = san.defineComponent({
    // template

    components: {
        'ui-node': 'self'
    }
});
```

## owner and parent

The concept of **owner** and **parent** has been clarified by react, but it is still specific here.

**owner** of a component is whoever creates the one and manages its lifetime, interactive communication, etc. **owner** must be a component. **owner**  of `ui-calendar` is component `AddForm`.

**parent** of a component is whoever would be the containing ancestor of the DOM hierarchy in view. **parent** of `ui-calendar` is the outer `div`。**parent** has no direct meaning to component management.


## ref

When declaring a subcomponent with a name specified by **s-ref**, you can call it from the **ref** method of the owner component instance.

`tips`: With declarative initialization, data binding, and event binding, we rarely need to get an instance of a subcomponent in the owner component. Although San provides this approach, when you use it, please think about whether you want to do this.


## message

With the **dispatch** method, components can dispatch messages to the upper layers of the component tree.

```javascript
var SelectItem = san.defineComponent({
    template: '<li on-click="select"><slot></slot></li>',

    select: function () {
        var value = this.data.get('value');

        // 向组件树的上层派发消息
        this.dispatch('UI:select-item-selected', value);
    }
});
```

The message will be passed up the component tree until it encounters the first component that processes the message. We can declare messages to be processed by the component in **messages**. **messages** is an object, the key is a message's name, and the value is a function of message handler that receives a parameter object containing the target (the component that dispatches the message) and the value (the value of the message).

```javascript
var Select = san.defineComponent({
    template: '<ul><slot></slot></ul>',

    // Declare messages that the component will process
    messages: {
        'UI:select-item-selected': function (arg) {
            var value = arg.value;
            this.data.set('value', value);

            // arg.target Get the component that dispatches the message
        }
    }
});
```

Messages are primarily used for components to communicate with upper-level components of non-**owner**. For example, the **owner** of the component SelectItem in the slot is the upper-level component. And it needs to communicate with Select.

```javascript
san.defineComponent({
    components: {
        'ui-select': Select,
        'ui-selectitem': SelectItem
    },

    template: ''
        + '<div>'
        + '  <ui-select value="{=value=}">'
        + '    <ui-selectitem value="1">one</ui-selectitem>'
        + '    <ui-selectitem value="2">two</ui-selectitem>'
        + '    <ui-selectitem value="3">three</ui-selectitem>'
        + '  </ui-select>'
        + '</div>'
});
```


## Dynamic Subcomponents

3.10.0 and latter versions support `s-is` directive to dynamically determine the class of subcomponents.

- The value of `s-is` directive can be an expression, and its evaluated value **SHOULD** be a string.
- The component class to be used is the one defined in `components` with a key equal to the value of `s-is` expression.

```javascript
var BLabel = san.defineComponent({
    template: '<b>{{text}}</b>'
});
var ULabel = san.defineComponent({
    template: '<u>{{text}}</u>'
});
var App = san.defineComponent({
    components: {
        'BLabel': BLabel,
        'ULabel': ULabel
    },
    template: '<div><text s-is="type" text="{{name}}"/></div>'
});
(new App({
    data: {
        name: 'San',
        type: 'BLabel'
    }
})).attach(document.body);
```

## Manually Created Subcomponents

In some scenarios, we want components to not create subcomponents when their own views are rendered, but rather to have the flexibility to create subcomponents at some point in the future. For example

- It is inconvenient using declarative way while **parent** of floating layer(subcomponent) is not in its root element **el**.
- The list needs to be created and displayed only when the user clicks


Be careful to create subcomponents manually. Here are some tips to note, and the following code fragment also gives some clarification.

- Manually created subcomponents don't have to be declared in `components`
- Avoid recreation. A simple approach is to keep a reference to the created subcomponents instance and check if it's already exists before creating.

```javascript
san.defineComponent({
    mainClick: function () {
        if (!this.layer) {
            this.layer = new Layer();
            this.layer.attach(document.body);

            // Alternatively, uncomment the following line and remove the `disposed` handler
            // this.children.push(this.layer);
        }

        this.layer.show();
    },

    disposed: function () {
        if (this.layer) {
            this.layer.dispose();
        }

        this.layer = null;
    }
});
```

In 3.7.0 and latter versions, manually created subcomponents supports `owner` and `source` options.

Specify `owner` to wire the subcomponent with its owner:

- The owner can receive messages dispatched from the subcomponent.
- The subcomponent will be automatically disposed when its owner is disposed.

`Note`:

If `owner` is specified, do **NOT** manually push the subcomponent into its owner's children. Or the subcomponent can be disposed multiple times.


Specify `source` to bind the manually created subcomponent to its owner:

- data binding (including 2-way data binding)
- events


```javascript
// Binding data and events of a manually created subcomponent to its owner via `owner` and `source` options.
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '  <button on-click="done">Done</button>'
        + '</div>',

    done: function () {
        this.fire('done', {
            name: this.data.get('name'),
            email: this.data.get('email')
        });
    }
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{{author.name}}" email="{{author.email}}" on-done="editDone($event)"/>'
            });
            this.editor.attach(document.body)
        }
    },

    editDone: function (e) {
        this.data.set('author', e);
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```


```javascript
// 2-way data binding of a manually created subcomponent to its owner via `owner` and `source` options.
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '</div>'
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{=author.name=}" email="{=author.email=}"/>'
            });
            this.editor.attach(document.body)
        }
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```


```javascript
// Dispatch events from a manually created subcomponent to its owner via the `owner` option.
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '  <button on-click="done">Done</button>'
        + '</div>',

    done: function () {
        this.dispatch('person-done', {
            name: this.data.get('name'),
            email: this.data.get('email')
        });
    }
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{{author.name}}" email="{{author.email}}"/>'
            });
            this.editor.attach(document.body)
        }
    },

    messages: {
        'person-done': function (e) {
            this.data.set('author', e.value);
        }
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```

`Note`: In cases where the manually created subcomponent with `source` option specified is expected to be created multiple times, the `source` template can be compiled manually to avoid San compiling it each time the subcomponent is created, as a measure of performance improvement.

```javascript
// Compiling source manually
// 3.7.0+
var PersonDetail = san.defineComponent({
    template: '<div>'
        + '  {{name}}, {{email}}'
        + '  <button on-click="close">close</button>'
        + '</div>',

    close: function () { this.el.style.display = 'none' },
    open: function () { this.el.style.display = 'block' }
});

var Person = san.defineComponent({
    template: '<div>'
        + '  name: {{info.name}}'
        + '  <button on-click="showDetail">detail</button>'
        + '</div>',

    // compile source manually
    detailSource: san.parseTemplate('<x-person name="{{info.name}}" email="{{info.email}}"/>')
        .children[0],

    showDetail: function () {
        if (!this.detail) {
            this.detail = new PersonDetail({
                owner: this,
                source: this.detailSource
            });
            this.detail.attach(document.body)
        }

        this.detail.open();
    }
});

var MyApp = san.defineComponent({
    template: '<div><x-p s-for="p in members" info="{{p}}" /></div>',

    components: {
        'x-p': Person
    }
});

var myApp = new MyApp({
    data: {
        members: [
            { name: 'errorrik', email: 'errorrik@what.com' },
            { name: 'otakustay', email: 'otakustay@what.com' }
        ]
    }
});
```

In 3.7.1 and latter versions, the `source` template allows child elements to specify slot contents to be inserted into the manually created subcomponent.


```javascript
// Specifying slot contents
// 3.7.1+
var Dialog = san.defineComponent({
    template: '<span><slot name="title"/><slot/></span>'
});

var MyApp = san.defineComponent({
    template: '<div><button on-click="alterStrong">alter strong</button></div>',

    attached: function () {
        if (!this.dialog) {
            this.dialog = new Dialog({
                owner: this,
                source: '<x-dialog>'
                    + '<h2 slot="title">{{title}}</h2>'
                    + '<b s-if="strongContent">{{content}}</b><u s-else>{{content}}</u>'
                    + '</x-dialog>'
            });
            this.dialog.attach(this.el);
        }
    },

    alterStrong: function () {
        this.data.set('strongContent', !this.data.get('strongContent'));
    }
});

var myApp = new MyApp({
    data: {
        title: 'MyDialog',
        content: 'Hello San',
        strongContent: true
    }
});
```