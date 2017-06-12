---
title: 组件API
categories:
- doc
---

该文档描述了组件的 API，在 San 主模块上暴露的 API 请参考文档 [主模块API](../../doc/main-members/)。


初始化参数
-------

### data

`解释`：

组件初始化数据。通常在[组件反解](../../tutorial/reverse/)的场景下使用。


`类型`： Object


`用法`：

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

`解释`：

组件根元素。传入此参数意味着不使用组件的 **template** 作为视图模板，组件视图由 San 自动反解。详情可参考[组件反解](../../tutorial/reverse/)文档。

`类型`： HTMLElement

`用法`：

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


生命周期钩子
-------

生命周期代表组件的生存过程，在每个过程到达时将触发钩子函数。具体请参考[生命周期](../../tutorial/component/#生命周期)文档。


### inited

`解释`：

组件实例初始化完成。组件上的 **inited** 方法将会被调用。


### compiled

`解释`：

组件视图模板编译完成。组件上的 **compiled** 方法将会被调用。


### created

`解释`：

组件元素创建完成。组件上的 **created** 方法将会被调用。


### attached

`解释`：

组件已被附加到页面中。组件上的 **attached** 方法将会被调用。


### detached

`解释`：

组件从页面中移除。组件上的 **detached** 方法将会被调用。


### disposed

`解释`：

组件卸载完成。组件上的 **disposed** 方法将会被调用。


### updated

`解释`：

组件由于数据变化，视图完成一次刷新。组件上的 **updated** 方法将会被调用。


定义组件成员
-------

### template

`解释`：

组件的视图模板。详细描述请参考[视图模板](../../tutorial/component/#视图模板)文档。

`类型`： string

`用法`：

```javascript
san.defineComponent({
    template: '<span title="{{text}}">{{text}}</span>'
});
```

### filters

`解释`：

声明组件视图模板中可以使用哪些过滤器。详细描述请参考[过滤器](../../tutorial/component/#过滤器)文档。

`类型`： Object

`用法`：

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

`解释`：

声明组件中可以使用哪些类型的子组件。详细描述请参考[components](../../tutorial/component/#components)文档。

`类型`： Object

`用法`：

```javascript
var AddForm = san.defineComponent({
    components: {
        'ui-timepicker': TimePicker,
        'ui-calendar': Calendar
    }
});
```


### computed

`解释`：

声明组件中的计算数据。详细描述请参考[计算数据](../../tutorial/component/#计算数据)文档。

`类型`： Object

`用法`：

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

`解释`：

声明处理子组件派发消息的方法。详细描述请参考[消息](../../tutorial/component/#消息)文档。

`类型`： Object

`用法`：

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

`解释`：

返回组件实例的初始数据。详细描述请参考[初始数据](../../tutorial/component/#初始数据)文档。

`类型`： function():Object

`用法`：

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



组件方法
-------

### fire

`描述`： fire({string}eventName, {*}eventArgument)

`解释`：

派发一个自定义事件。San 为组件提供了自定义事件功能，组件开发者可以通过该方法派发事件。事件可以在视图模板中通过 **on-** 的方式绑定监听，也可以通过组件实例的 **on** 方法监听。可参考[Event](../../tutorial/event/#自定义事件)文档。


`用法`：


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

`解释`：

添加自定义事件监听器。 **on** 一般仅用在使用 JavaScript 动态创建的组件中，通过视图模板创建的子组件应通过 **on-** 的方式绑定监听。可参考[动态子组件](../../tutorial/component/#动态子组件)文档


### un

`描述`： un({string}eventName, {Function=}eventListener)

`解释`：

移除事件监听器。 当 eventListener 参数为空时，移除所有 eventName 事件的监听器。


### dispatch

`描述`： dispatch({string}name, {*}value)

`解释`：

派发一个消息。消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件。上层组件通过 **messages** 声明组件要处理的消息。消息主要用于组件与非 **owner** 的上层组件进行通信。可参考[消息](../../tutorial/component/#消息)文档。


`用法`：


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

`解释`：

监听组件的数据变化。通常我们使用绑定，在子组件数据变化时自动更新父组件的对应数据。 **watch** 一般仅用在使用 JavaScript 动态创建的组件中。可参考[动态子组件](../../tutorial/component/#动态子组件)文档


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

`解释`：

获取定义了 **s-ref** 的子组件。详细请参考[组件层级](../../tutorial/component/#组件层级)文档。

`用法`：


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




