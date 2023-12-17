---
title: Component API
categories:
- doc
---

This document describes components API, the San module API
please refer to [San API](../main-members/).


Initialization Arguments
-------

### data

`Explanation`:

Component initialization data. Usually used in the [component hydrate](../../component/hydrate/) scenario.

`Type`: Object

`Usage`:

```javascript
var MyComponent = san.defineComponent({});

var myComponent = new MyComponent({
    el: document.getElementById('my-label'),
    data: {
        email: 'errorrik@gmail.com',
        name: 'errorrik'
    }
});

/* html:
<label id="my-label">
    <span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span>
</label>
```


### el

`explanation`:

Component root element. Passing in this parameter means that the component's **template** is not used as the view template, and the component view is automatically reversed by San. See [here](../../component/hydrate/) for more details.

`type`: HTMLElement

`code`:

```javascript
var MyComponent = san.defineComponent({});

var myComponent = new MyComponent({
    el: document.getElementById('my-label'),
    data: {
        email: 'errorrik@gmail.com',
        name: 'errorrik'
    }
});

/* html:
<label id="my-label">
    <span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span>
</label>
*/
```


### transition

`explanation`:

The transition animation controller for the component. See [animation controller](../../tutorial/transition/#Animation-Controller) and [animation controller creator](../../tutorial/transition/#Animation-Controller-Creator) for more details.


`version`: >= 3.6.0

`type`: Object

`code`:

```javascript
var MyComponent = san.defineComponent({
    template: '<span>transition</span>'
});

var myComponent = new MyComponent({
    transition: {
        enter: function (el, done) { /* Transition animation when entering */ },
        leave: function (el, done) { /* Transition animation when leaving */ },
    }
});
```


Lifecycle hooks
-------

The life cycle represents the survival process of the component, and the hook function is triggered when each process arrives. See [lifecycle](../../component/lifecycle/) for more details.

### compiled

`explanation`:

The component view template is compiled. The **compiled** method on the component will be called.

### inited

`explanation`:

The component instance initialization is complete. The **inited** method on the component will be called.


### created

`explanation`:

The component element is created. The **created** method on the component will be called.


### attached

`explanation`:

The component has been attached to the page. The **attached** method on the component will be called.


### detached`

`explanation`:

The component is removed from the DOM. The **detached** method on the component will be called.

### disposed

`explanation`:

The component is removed from the DOM and components had destroyed. The **disposed** method on the component will be called.

### updated

`explanation`:

The component completes a refresh due to data changes. The **updated** method on the component will be called.

### error

`version`：>= 3.10.7

`explanation`：

Called when an error from any descendent component is captured. The hook receives three arguments: the error, the component instance that triggered the error, and a string containing information on where the error was captured. The hook will stop the error from propagating further.

define Component
-------

### template

`explanation`:

The view template for the component. see [component template](../../component/view/#Component-Template) for more details.

`type`: string

`usage`:

```javascript
san.defineComponent({
    template: '<span title="{{text}}">{{text}}</span>'
});
```

### filters

`explanation`:

Declare which filters can be used in a component view template. see [filter](../../component/view/#Filter) for more details.

`type`: Object

`usage`:

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


`Warning`:

The filter method can access the component's data through `this.data` at runtime, however doing so can result in an implicit dependency on the data, causing the view to not update as the data changes. Therefore, the filter method should be a pure function with no side effects.

```javascript
var Bad = san.defineComponent({
    template: '<u>{{num | enhance}}</u>',

    filters: {
        enhance: function (n) {
            return n * this.data.get('times');
        }
    },

    initData: function () {
        return {
            num: 2,
            times: 3
        };
    }
});

var Good = san.defineComponent({
    template: '<u>{{num | enhance(times)}}</u>',

    filters: {
        enhance: function (n, times) {
            return n * times;
        }
    },

    initData: function () {
        return {
            num: 2,
            times: 3
        };
    }
});
```


### components

`explanation`:

Declare which types of subcomponents can be used in a component. see [components](../../component/tree/#components) for more details.

`type`: Object

`usage`:

```javascript
var AddForm = san.defineComponent({
    components: {
        'ui-timepicker': TimePicker,
        'ui-calendar': Calendar
    }
});
```


### computed

`explanation`:

Declare the calculated data in the component. see [computed data](../../component/data/#Computed-Data) for more details.

`type`: Object

`usage`:

```javascript
san.defineComponent({
    template: '<a>{{name}}</a>',

    // The name data item is calculated from firstName and lastName
    computed: {
        name: function () {
            return this.data.get('firstName') + ' ' + this.data.get('lastName');
        }
    }
});
```

### messages

`explanation`:

declare how to handle subcomponent dispatch messages. see [message](../../component/tree/#message) for more details.

`type`: Object

`usage`:

```javascript
var Select = san.defineComponent({
    template: '<ul><slot></slot></ul>',

    messages: {
        'UI:select-item-selected': function (arg) {
            // arg.target can get the component that dispatches the message
            var value = arg.value;
            this.data.set('value', value);
        }
    }
});
```


### initData

`explanation`:

Return the initial data of the component instance. see [init data](../../component/data/#Initializing-Data) for more details.

`type`: function():Object

`usage`:

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});
```


### trimWhitespace

Defines the trim mode for whitespace characters when parsing component templates.

- **none**(default) nothing
- **blank** clear blank text node
- **all** clear the leading and trailing whitespace characters of all text nodes.

`version`: >= 3.2.5

`type`: string

`usage`:

```javascript
var MyApp = san.defineComponent({
    trimWhitespace: 'blank'

    // ,
    // ......
});
```

### delimiters

`explanation`:

Define the separator for interpolation when parsing a component template. An array of 2 items with starting and ending delimiters.

default:

```js
['{{', '}}']
```

`version`: >= 3.5.0

`type`: Array

`usage`:

```javascript
var MyComponent = san.defineComponent({
    delimiters: ['{%', '%}'],
    template: '<a><span title="Good {%name%}">Hello {%name%}</span></a>'
});
```

### transition (Deprecated)

`Explanation`:

Transition animation controller that defines the root node of the component.

`Version`: >= 3.3.0, < 3.6.0

`Type`: Object

`Usage`:

```javascript
var MyComponent = san.defineComponent({
    template: '<span>transition</span>',
    transition: {
        enter: function (el) { /* transition animation when the root node enters */ },
        leave: function (el, done) { /* transition animation when the root node leaves */ },
    }
});
```

### updateMode

`Explanation`:

This property specifies how the view should update. Currently only `"optimized"` is supported. When this is set, `s-for` directive updates the view using a more performance friendly method according to each browser, in this case DOM elements may not be correctly reused (but is faster).

`Version`: >= 3.7.4

`Type`: string

`Usage`:

```javascript
var MyComponent = san.defineComponent({
    updateMode: 'optimized',
    template: '<ul><li s-for="item in list">{{item}}</li></ul>'
});
```

### aNode

`Explanation`:

The parse result of `.template`. To speed up initialization, template will not be compiled again during component instantiation if the `.aNode` property exists. `.aNode` is used by pre-compile optimization and typically generated by build tools, you are not required to include it in source codes. Use [san-anode-utils](https://github.com/ecomfe/san-anode-utils) to work with [ANode](https://github.com/baidu/san/blob/master/doc/anode.md).

`Type`: Object

`Usage`:

```javascript
var MyComponent = san.defineComponent({
    // equal to "template: '<p>Hello {{name}}</p>'"
    aNode: {
        "directives": {},
        "props": [
            {
                "name": "class",
                "expr": {
                    "type": 5,
                    "expr": {
                        "type": 4,
                        "paths": [
                            {
                                "type": 1,
                                "value": "class"
                            }
                        ]
                    },
                    "filters": [
                        {
                            "type": 6,
                            "args": [],
                            "name": {
                                "type": 4,
                                "paths": [
                                    {
                                        "type": 1,
                                        "value": "_class"
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "name": "style",
                "expr": {
                    "type": 5,
                    "expr": {
                        "type": 4,
                        "paths": [
                            {
                                "type": 1,
                                "value": "style"
                            }
                        ]
                    },
                    "filters": [
                        {
                            "type": 6,
                            "args": [],
                            "name": {
                                "type": 4,
                                "paths": [
                                    {
                                        "type": 1,
                                        "value": "_style"
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "name": "id",
                "expr": {
                    "type": 4,
                    "paths": [
                        {
                            "type": 1,
                            "value": "id"
                        }
                    ]
                }
            }
        ],
        "events": [],
        "children": [
            {
                "textExpr": {
                    "type": 7,
                    "segs": [
                        {
                            "type": 1,
                            "value": "Hello "
                        },
                        {
                            "type": 5,
                            "expr": {
                                "type": 4,
                                "paths": [
                                    {
                                        "type": 1,
                                        "value": "name"
                                    }
                                ]
                            },
                            "filters": []
                        }
                    ]
                }
            }
        ],
        "tagName": "p"
    }
});
```

### aPack

`Explanation`:

A compressed version of `aNode`. `aPack` has a much smaller size than `aNode` and the decompression is faster than that parsing `template` in place. Like `aNode`, `aPack` is used by pre-compile optimization and typically generated by build tools. Use [san-anode-utils](https://github.com/ecomfe/san-anode-utils) to work with [aPack](https://github.com/baidu/san/blob/master/doc/anode-pack.md).

`Version`: >= 3.9.0

`Type`: Array

`Usage`:

```javascript
var MyComponent = san.defineComponent({
    // equal to "template: '<p>Hello {{name}}</p>'"
    aPack: [1,"p",4,2,"class",7,,6,1,3,"class",1,8,6,1,3,"_class",,2,"style",7,,6,1,3,"style",1,8,6,1,3,"_style",,2,"id",6,1,3,"id",,9,,2,3,"Hello ",7,,6,1,3,"name",]
});
```

Component Method
-------

### fire

`description`: fire({string}eventName, {*}eventArgument)

`explanation`:

Fire a custom event. San provides custom event functionality for components. Component developers can fire events through this method. Events can be bound in the view template by **on-**, or be listened to by the **on** method of the component instance. see [customized event](../../tutorial/event/#customized-event) for more details.

`usage`:


```javascript
var Label = san.defineComponent({
    template: '<template class="ui-label"><a on-click="clicker" title="{{text}}">{{text}}</a></template>',

    clicker: function () {
        this.fire('customclick', this.data.get('text') + ' clicked');
    }
});

var MyComponent = san.defineComponent({
    initData: function () {
        return {name: 'San'};
    },

    components: {
        'ui-label': Label
    },

    template: '<div><ui-label text="{{name}}" on-customclick="labelClicker($event)"></ui-label></div>',

    labelClicker: function (doneMsg) {
        alert(doneMsg);
    }
});
```

### on

`description`: on({string}eventName, {Function}eventListener)

`explanation`:

Add a custom event listener.  **on** is generally only used in components that are dynamically created using JavaScript. Subcomponents created through view template should be bound by **on-**. see [dynamic child components](../../component/tree/##Dynamic-Subcomponents) for more details.

### un

`description`: un({string}eventName, {Function=}eventListener)

`explanation`:

Remove event listener. Remote the listeners for all eventName events when the eventListener params is empty.

### dispatch

`description`: dispatch({string}name, {*}value)

`explanation`:

Dispatch a message. The message will be passed up in the component tree util it encounters the first component that processes the message. The upper component declares the message to be processed by the component via **message**. The message is mainly used for communication between components with none owner upper components. see [message](../../component/tree/#message) for more details.

`usage`:


```javascript
var SelectItem = san.defineComponent({
    template:
        '<li on-click="select" class="{{value === selectValue ? \'selected\' : \'\'">'
        + '<slot></slot>'
        + '</li>',

    // child component dispatch message anytime.
    select: function () {
        var value = this.data.get('value');
        this.dispatch('UI:select-item-selected', value);
    },

    attached: function () {
        this.dispatch('UI:select-item-attached');
    },

    detached: function () {
        this.dispatch('UI:select-item-detached');
    }
});

var Select = san.defineComponent({
    template: '<ul><slot></slot></ul>',

    // upper component process message when needed.
    messages: {
        'UI:select-item-selected': function (arg) {
            var value = arg.value;
            this.data.set('value', value);

            // Upper component can modify child component's data in principle. Because the update stream is top-down.
            var len = this.items.length;
            while (len--) {
                this.items[len].data.set('selectValue', value);
            }
        },

        'UI:select-item-attached': function (arg) {
            this.items.push(arg.target);
            arg.target.data.set('selectValue', this.data.get('value'));
        },

        'UI:select-item-detached': function (arg) {
            var len = this.items.length;
            while (len--) {
                if (this.items[len] === arg.target) {
                    this.items.splice(len, 1);
                }
            }
        }
    },

    inited: function () {
        this.items = [];
    }
});

var MyComponent = san.defineComponent({
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


### watch

`description`: watch({string}dataName, {function({*}value)}listener)

`explanation`:

Watch component's data changes. Usually we use bindings to automatically update the corresponding data of the parent component when the child component data changes. **watch** is generally only used in components that are dynamically created using JavaScript. see [dynamic child components](../../component/tree/##Dynamic-Subcomponents) for more details.


```javascript
san.defineComponent({
    // ...

    initLayer: function () {
        if (!this.monthView) {
            var monthView = new MonthView();
            this.monthView = monthView;

            this.monthView.watch('value', (function (value) {
                this.data.set('value', value);
            }).bind(this));

            this.watch('value', function (value) {
                monthView.data.set('value', value);
            });

            this.monthView.attach(document.body);
        }
    }
});
```

### ref

`description`: ref({string}name)

`explanation`:

Get the subcomponents that define **s-ref**. see [component tree](../../component/tree/) for more details.

`usage`:


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

/* template:
<div class="form">
    <div>Expected completion time:
        <ui-calendar bindx-value="endTimeDate" s-ref="endDate"></ui-calendar>
        <ui-timepicker bindx-value="endTimeHour" s-ref="endHour"></ui-timepicker>
    </div>

    <div class="form-op">
        <button type="button" on-click="submit">ok</button>
    </div>
</div>
*/
```

### slot

`version`: >= 3.3.0

`description`: {Array} slot({string=}name)

`explanation`:

Get the node information of the component slot. The return value is an array, and the items in the array are node objects and usually only one. And there will be more that one node objects when if or for is applied in the slot declaration. The node objects include `isScoped`, `isInserted`, and `children` property. see [slot](../../tutorial/slot/) for more details.

`attention`: do not make any modifications to the returned slot object. If you want to manipulate the view changes, please manipulate the data.

`usage`:


```javascript
var Panel = san.defineComponent({
    template: '<div><slot s-if="!hidden"/></div>',
});

var MyComponent = san.defineComponent({
    components: {
      'x-panel': Panel
    },

    template: ''
        + '<div>'
          + '<x-panel hidden="{{folderHidden}}" s-ref="panel"><p>{{desc}}</p></x-panel>'
        + '</div>',

    attached: function () {
        // 1
        this.ref('panel').slot().length

        var contentSlot = this.ref('panel').slot()[0];

        // truthy
        contentSlot.isInserted

        // falsy
        contentSlot.isScoped
    }
});


var myComponent = new MyComponent({
    data: {
        desc: 'MVVM component framework',
    }
});
```

### nextTick

`explanation`:

San's view update is asynchronous. After the component data is changed, the view will be updated in the next clock cycle. If you modify some data and want to do something after the DOM update, you need to use the `nextTick` method.

`usage`:

```javascript
const Component = san.defineComponent({
    template: `
        <div>
            <div s-ref="name">{{name}}</div>
            <button on-click="clicker">change name</button>
        </div>
    `,

    initData() {
        return {name: 'erik'};
    },

    clicker() {
        this.data.set('name', 'leeight');
        console.log(this.ref('name').innerHTML); // erik
        this.nextTick(() => {
            console.log(this.ref('name').innerHTML); // leeight
        });
    }
});
```
