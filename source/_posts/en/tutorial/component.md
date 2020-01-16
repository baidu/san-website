---
title: Components
categories:
- tutorial
---

Component, the basic unit of San, is an independent unit of data, logic, and view. From a page perspective, a component is an extension of an HTML element; from a functional mode perspective, a component is a ViewModel.

Component defining
------

The most basic way to define a component is to inherit from **san.Component**. San also provides the **san.inherits** method for inheritance.

```javascript
function MyApp(options) {
    san.Component.call(this, options);
}
san.inherits(MyApp, san.Component);

MyApp.prototype.template = '<ul><li s-for="item in list">{{item}}</li></ul>';

MyApp.prototype.attached = function () {
    this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
};
```

Then you can use this component by creating an instance with 'new' method. Obviously, if you want the component to appear on the page, you need to call the attach method to render the component inside root DOM.

```javascript
var myApp = new MyApp();
myApp.attach(document.body);
```

The advantage of defining components in an inherited way is that when you use ESNext, you can naturally use **extends**.

`tips`: Since ESNext itself does not support overwriting prototype, San supports the static property. You should define template/filters/components properties as static property when use extends a component in ESNext.

```javascript
import {Component} from 'san';

class HelloComponent extends Component {

    constructor(options) {
        super(options);
        // .....
    }

    static template = '<p>Hello {{name}}!</p>';

    initData() {
        return {name: 'San'}
    }
}

new HelloComponent().attach(document.body);
```

When defining a component in non-ESNext way, it is boring to create a function, call **san.inherits** and define various prototypes. San provides a shortcut method **san.defineComponent** to make it easy.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});
```


Lifecycle
------

San components use HTML-based template syntax in order too keep their lifecycles consistent with WebComponents.

- `compiled` - Compiled the template of a component
- `inited` - Initialized a component instance with template and data
- `created` - Created a component element
- `attached` - Attached a component to DOM
- `detached` - Detached a component from DOM
- `disposed` - Destoryed a component instance

The lifecycle of a component has some of these features.

- The lifecycle represents the state of the component. The essence of the lifecycle is state management.
- At the different stages of the life cycle, the component will trigger the corresponding hook functions.
- States coexist such as `attached` and `created`.
- States are mutually exclusive such as `attached` and `detached` , `disposed` and others.
- Some time points do not represent the state of the component, only a certain behavior. The hook function is also triggered when the behavior is completed. For example, **updated** represents the completion of the view change caused by each data change.


Through the hook function of the life cycle, we can customize to do something in different lifecycles. For example, in the **attached** lifecycle initiate a request to get data, and then update the data to refresh the view.

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


The following diagram details the lifecycle of the component

<img src="../../../img/life-cycle.png" width="540">


View
------

### component template

When defining a component, you can assign a component's view template through the `template`.


```javascsript
san.defineComponent({
    template: '<div>'
        + '<label><input type="checkbox" value="errorrik" checked="{= online =}">errorrik</label>'
        + '<label><input type="checkbox" value="otakustay" checked="{= online =}">otakustay</label>'
        + '<label><input type="checkbox" value="firede" checked="{= online =}">firede</label>'
        + '</div>',

    initData: function () {
        return {
            online: ['errorrik', 'otakustay']
        };
    }
});
```

Usually, it's not friendly to write HTML snippets in JavaScript. We can write templates in separate files and manage them through tools or loaders.

Referencing a template by webpack + ESNext:

```
TODO
```

Referencing a template via the text plugin in an AMD environment

```javascript
san.defineComponent({
    template: require('text!./template.html'),

    initData: function () {
        return {
            online: ['errorrik', 'otakustay']
        };
    }
});
```

`attention`. It is a rule of San template that is for a component to return **one** HTML element. You should group a list of children with adding root element.

```html
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

The HTML element corresponding to the component may be specified by its **owner** component through the view template, and the view template does not directly declare the corresponding HTML element. You can now specify the HTML element of the view template as **template**.

```html
<template class="ui-timepicker">{{ value | valueText }}</template>
```


### slot

The position of a slot can be declared in the view template by slot, the content of which can be defined by the outer component. Refer to the [slot](../slot/) document for more details.

```javascript
var Panel = san.defineComponent({
    template: '<div>'
        + '  <div class="head" on-click="toggle">title</div>'
        + '  <p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
        + '</div>',

    toggle: function () {
        this.data.set('fold', !this.data.get('fold'));
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-panel': Panel
    },

    template: '<div><ui-panel>Hello San</ui-panel></div>'
});

/*  MyComponent rendered
<div>
  <div class="head">title</div>
  <p style="display:none">Hello San</p>
</div>
*/
```


### el


The properties of the component instance **el** represents the HTML element of the component, which can be passed in via `option` when the component is initialized.

Most of the time you don't need to care about it when writing components. But if you pass **el** when you initialize the component, it means that the component has this element as the component root element. And the element will:

- not render the view using the default template
- not create a root element
- directly call compiled, created, attached lifecycle

Sometimes we want the initial view to be direct HTML for the first time, not by the component rendering. But at the same time, we want components to manage data, logic, and views for us, as well as subsequent user interactions and view transformations through component management. In this case, you can pass in an existing element via **el**.

The component will take the element passed in by **el** as the component root element and parse out the view structure. This process is called **component reversal**. Refer to the [component reversal](../reverse/) document for more.


Data
----

All component data related operations are provided by the **data** property of the component instance.

### retrieving data

Retrieve data through the **data.get** method.

```javascript
san.defineComponent({
    attached: function () {
        var params = this.data.get('params');
        this.data.set('list', getList(params[1]));
    }
});
```

The **data.get**  method accepts a string representing the `property accessor`, so the above example can also be written like this:

```javascript
san.defineComponent({
    attached: function () {
        var param = this.data.get('params[1]');
        this.data.set('list', getList(param));
    }
});
```

### manipulating data

**data** provides some methods of data manipulation. Refer to the [data method](../data-method/) document for more.


### initializing data

When the component is instantiated, you can pass the **data** option to specify the component's initial data.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>'
});

var myApp = new MyApp({
    data: {
        list: ['san', 'er', 'esui', 'etpl', 'esl']
    }
});
myApp.attach(document.body);
```

Passing in the initial data when `new` a component is not a common parttern. In general, If you want to set initial data for each instance when you define a component, you can specify it in the **initData** method. The **initData** method returns initial data for the component instance.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});

var myApp = new MyApp();
myApp.attach(document.body);
```

### computed data

Sometimes, the value of a data item may be computed from other data items, and we can define  **computed** to compute data. **computed** is an object, the key is the name of the computed data item, and value is a function that returns the value of the data item.

```javascript
san.defineComponent({
    template: '<a>{{name}}</a>',

    // name 数据项由 firstName 和 lastName 计算得来
    computed: {
        name: function () {
            return this.data.get('firstName') + ' ' + this.data.get('lastName');
        }
    }
});
```

In this case, item  `name` is a computed data, whose value computed from `firstName` and `lastName` data item.

`tips`: In functions of computing data, you can only use the *this.data.get* method to get the values of data items. You cannot call a component method with this.method or set the component data with this.data.set.

```javascript
san.defineComponent({
    template: '<a>{{info}}</a>',

    // name 数据项由 firstName 和 lastName 计算得来
    computed: {
        name: function () {
            return this.data.get('firstName') + ' ' + this.data.get('lastName');
        },

        info: function () {
            return this.data.get('name') + ' - ' + this.data.get('email');
        }
    }
});
```

The computed data item can depend on another computed data item. In the above example, the `name` item that the `info` item depends on is a computed data item. However, be careful when using it, do not form a circular dependency between the computed data items.

Filter
------

Interpolation is a common way of presenting data when defining view templates. When writing interpolation, we often use **filter** to convert the data into a form suitable for view presentation.

```
{{createTime | dateFormat('yyyy-MM-dd')}}
```

### Built-in filter


San has several filters built in for common scenarios

- `html` - Escaping HTML. This filter is used by default when no filter is specified.
- `url` - Escaping URL
- `raw` - No escaping. Use this filter when you don't want to use HTML escaping


### Customized filter

By defining the component's **filters** member, you can specify which filters the component's view template can use.

```javascript
san.defineComponent({
    template: '<a>{{createTime | dateFormat("yyyy-MM-dd")}}</a>',

    filters: {
        dateFormat: function (value, format) {
            return moment(value).format(format);
        }
    }
});
```

The first parameter of the filter function is the data value corresponding to the expression. The parameters passed in the filter call are followed by the second parameter.

`tips`: Given the independence of components, San does not provide a way to register global filters. Defining the filters used by components must be in their own **filters**.



Component Level
-----

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


### components

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

### owner 与 parent

The concept of **owner** and **parent** has been clarified by react, but it is still specific here.

**owner** of a component is whoever creates the one and manages its lifetime, interactive communication, etc. **owner** must be a component. **owner**  of `ui-calendar` is component `AddForm`.

**parent** of a component is whoever would be the containing ancestor of the DOM hierarchy in view. **parent** of `ui-calendar` is the outer `div`。**parent** has no direct meaning to component management.


### ref

When declaring a subcomponent with a name specified by **s-ref**, you can call it from the **ref** method of the owner component instance.

`tips`: With declarative initialization, data binding, and event binding, we rarely need to get an instance of a subcomponent in the owner component. Although San provides this approach, when you use it, please think about whether you want to do this.


### message

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


### dynamic child components

In some scenarios, we want components to not create subcomponents when their own views are rendered, but rather to have the flexibility to create subcomponents at some point in the future. For example

- It is inconvenient using declarative way while **parent** of floating layer(subcomponent) is not in its root element **el**.
- The list needs to be created and displayed only when the user clicks


Dynamic subcomponents are more demanding for developers. Here are some tips to note, and the following fragment also gives some simple instructions.

- Dynamically created subcomponents do not need to declare types in **components**
- Ensure not creating dynamic subcomponents repeatedly. A typical practice is attaching a reference of the dynamic subcomponents to the component as properties and judgments by these properties.
- Ensure that dynamic subcomponents can be destroyed. You can push them into **children** at creation time or destroy it manually in **disposed**

```javascript
san.defineComponent({
    mainClick: function () {
        if (!this.layer) {
            this.layer = new Layer();
            this.layer.attach(document.body);

            // 如果有下面一句，则可以不用手动在 disposed 中释放
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
