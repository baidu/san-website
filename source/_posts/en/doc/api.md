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

`Explanation`：

Initialization Data. Can be used for [component reverse](../../tutorial/reverse/).


`Type`： Object


`Usage`：

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

`description`：

the root of the component. the value of this param is a DOM Element and San will take this component's innerHTML value as the component template.  See [here](../../tutorial/reverse/) for more details.

`type`： HTMLElement

`code`：

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

`description`：

the controller of component's animation. See [animation controller](../../tutorial/transition/#Animation-Controller) and [animation controller creator](../../tutorial/transition/#Animation-Controller-Creator) for more details.


`version`：>= 3.6.0

`type`： Object

`code`：

```javascript
var MyComponent = san.defineComponent({
    template: '<span>transition</span>'
});

var myComponent = new MyComponent({
    transition: {
        enter: function (el, done) { /* 进入时的过渡动画 */ },
        leave: function (el, done) { /* 离开时的过渡动画 */ },
    }
});
```


Lifecycle hooks
-------

The lifecycle described all state of a component including mounting, updating and destroyed. It will invoke a bind function when component reached progress. See [lifecycle](../../tutorial/component/#lifecycle) for more details.


### compiled

`description`：

Trigged when component's template compiled. 


### inited

`description`：

Trigged when component is inited.


### created

`description`：

Trigged when the DOM element is created.


### attached

`description`：

Trigged when the DOM element is appended to the body.


### detached`

`description`：

Trigged when the DOM element is removed from the body.

### disposed

`description`：

Trigged when the DOM element is removed from the body and the state of component destroyed.

### updated

`description`：

Trigged when component's state changed and view update once.


define Component
-------

### template

`description`：

the template of component. see [component template](../../tutorial/component/#component-template) for more details.

`type`： string

`usage`：

```javascript
san.defineComponent({
    template: '<span title="{{text}}">{{text}}</span>'
});
```

### filters

`description`：

the filter function can be used in the template. see [filter](../../tutorial/component/#filter) for more details.

`type`： Object

`usage`：

```javascript
san.defineComponent({
    template: '<a>{{createTime | dateFormat('yyyy-MM-dd')}}</a>',

    filters: {
        dateFormat: function (value, format) {
            return moment(value).format(format);
        }
    }
});
```

### components

`description`：

define which kinds of child components can be used inside of the component. see [components](../../tutorial/component/#components) for more details.

`type`： Object

`usage`：

```javascript
var AddForm = san.defineComponent({
    components: {
        'ui-timepicker': TimePicker,
        'ui-calendar': Calendar
    }
});
```


### computed

`description`：

declare the computed value of the component. see [computed data](../../tutorial/component/#computed-data) for more details.

`类型`： Object

`usage`：

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

### messages

`description`：

声明处理子组件派发消息的方法。详细描述请参考[message](../../tutorial/component/#message)文档。

`类型`： Object

`usage`：

```javascript
var Select = san.defineComponent({
    template: '<ul><slot></slot></ul>',

    messages: {
        'UI:select-item-selected': function (arg) {
            // arg.target 可以拿到派发消息的组件
            var value = arg.value;
            this.data.set('value', value);
        }
    }
});
```


### initData

`description`：

返回组件实例的初始数据。详细描述请参考[init data](../../tutorial/component/#init-data)文档。

`类型`： function():Object

`usage`：

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

定义组件模板解析时对空白字符的 trim 模式。

- 默认为 **none**，不做任何事情
- **blank** 时将清除空白文本节点
- **all** 时将清除所有文本节点的前后空白字符

`版本`：>= 3.2.5

`类型`： string

`usage`：

```javascript
var MyApp = san.defineComponent({
    trimWhitespace: 'blank'

    // ,
    // ......
});
```

### delimiters

`description`：

定义组件模板解析时插值的分隔符。值为2个项的数组，分别为起始分隔符和结束分隔符。默认为:

```js
['{{', '}}']
```

`版本`：>= 3.5.0

`类型`： Array

`usage`：

```javascript
var MyComponent = san.defineComponent({
    delimiters: ['{%', '%}'],
    template: '<a><span title="Good {%name%}">Hello {%name%}</span></a>'
});
```

### transition

`description`：

定义组件根节点的过渡动画控制器。已废弃。


`版本`：>= 3.3.0, < 3.6.0

`类型`： Object

`usage`：

```javascript
var MyComponent = san.defineComponent({
    template: '<span>transition</span>',
    transition: {
        enter: function (el) { /* 根节点进入时的过渡动画 */ },
        leave: function (el, done) { /* 根节点离开时的过渡动画 */ },
    }
});
```


组件方法
-------

### fire

`描述`： fire({string}eventName, {*}eventArgument)

`description`：

派发一个自定义事件。San 为组件提供了自定义事件功能，组件开发者可以通过该方法派发事件。事件可以在视图模板中通过 **on-** 的方式绑定监听，也可以通过组件实例的 **on** 方法监听。可参考[customized event](../../tutorial/event/#customized-event)文档。


`usage`：


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

`描述`： on({string}eventName, {Function}eventListener)

`description`：

添加自定义事件监听器。 **on** 一般仅用在使用 JavaScript 动态创建的组件中，通过视图模板创建的子组件应通过 **on-** 的方式绑定监听。可参考[dynamic child components](../../tutorial/component/#dynamic-child-components)文档


### un

`描述`： un({string}eventName, {Function=}eventListener)

`description`：

移除事件监听器。 当 eventListener 参数为空时，移除所有 eventName 事件的监听器。


### dispatch

`描述`： dispatch({string}name, {*}value)

`description`：

派发一个消息。消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件。上层组件通过 **messages** 声明组件要处理的消息。消息主要用于组件与非 **owner** 的上层组件进行通信。可参考[message](../../tutorial/component/#message)文档。


`usage`：


```javascript
var SelectItem = san.defineComponent({
    template: 
        '<li on-click="select" class="{{value === selectValue ? \'selected\' : \'\'">'
        + '<slot></slot>'
        + '</li>',

    // 子组件在各种时机派发消息
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

    // 上层组件处理自己想要的消息
    messages: {
        'UI:select-item-selected': function (arg) {
            var value = arg.value;
            this.data.set('value', value);

            // 原则上上层组件允许更改下层组件的数据，因为更新流是至上而下的
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

`描述`： watch({string}dataName, {function({*}value)}listener)

`description`：

监听组件的数据变化。通常我们使用绑定，在子组件数据变化时自动更新父组件的对应数据。 **watch** 一般仅用在使用 JavaScript 动态创建的组件中。可参考[dynamic child components](../../tutorial/component/#dynamic-child-components)文档


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

`描述`： ref({string}name)

`description`：

获取定义了 **s-ref** 的子组件。详细请参考[component level](../../tutorial/component/#component-level)文档。

`usage`：


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
    <div>预期完成时间：
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

`版本`：>= 3.3.0

`描述`： {Array} slot({string=}name)

`description`：

获取组件插槽的节点信息。返回值是一个数组，数组中的项是节点对象。通常只有一项，当 slot 声明中应用了 if 或 for 时可能为 0 项或多项。节点对象包含 isScoped 、 isInserted 和 children。

插槽详细usage请参考 [slot](../../tutorial/component/#slot) 文档。

`注意`：不要对返回的 slot 对象进行任何修改。如果希望操作视图变更，请操作数据。

`usage`：


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

`description`：

San 的视图更新是异步的。组件数据变更后，将在下一个时钟周期更新视图。如果你修改了某些数据，想要在 DOM 更新后做某些事情，则需要使用 `nextTick` 方法。

`usage`：

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
