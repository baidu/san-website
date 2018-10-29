---
title: Slots
categories:
- tutorial
---

Templates can contain slots, the contents in which position can be defined by its parent component.

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

/* Render results for MyComponent
<div>
  <div class="head">title</div>
  <p style="display:none">Hello San</p>
</div>
*/
```

Please refer to [the HTML Spec](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#slots) for more information about slots.


Data Scope
-------

Inside a slot, the scope is **the parent component's scope**.

```javascript
var Panel = san.defineComponent({
    template: '<div>'
        + '  <div class="head" on-click="toggle">title</div>'
        + '  <p><slot></slot></p>'
        + '</div>',

    initData: function () {
        return {name: 'Panel'};
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-panel': Panel
    },

    template: '<div><ui-panel>I am {{name}}</ui-panel></div>',

    initData: function () {
        return {name: 'MyComponent'};
    }
});

/* Render results for MyComponent
<div>
  <div class="head">title</div>
  <p>I am MyComponent</p>
</div>
*/
```

Named Slots
-----

Slots can be named by assigning a name attribute. A template can contain one unnamed slot and multiple named slots. By declaring the attribute `slot="name"`, parent components can specify where the contents are placed in.


```javascript
var Tab = san.defineComponent({
    template: '<div>'
        + '  <header><slot name="title"></slot></header>'
        + '  <main><slot></slot></main>'
        + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: '<div><ui-tab>'
        + '<h3 slot="title">1</h3><p>one</p>'
        + '<h3 slot="title">2</h3><p>two</p>'
        + '</ui-tab></div>'
});

/* Render results for MyComponent
<div>
  <header><h3>1</h3><h3>2</h3></header>
  <main><p>one</p><p>two</p></main>
</div>
*/
```

`Note`: `slot="name"` attribute only takes effect when specified on the direct child of the component element to be injected. The `a` element will NOT be rendered into the `title` slot.

```javascript
var Tab = san.defineComponent({
    template: '<div>'
        + '  <header><slot name="title"></slot></header>'
        + '  <main><slot></slot></main>'
        + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: '<div><ui-tab>'
        + '<h3 slot="title">1</h3><p>one</p>'
        + '<h3 slot="title">2</h3><p>two<a slot="title">slot fail</a></p>'
        + '</ui-tab></div>'
});

/* Render results for MyComponent, the `a` element is not injected into the `title` slot
<div>
  <header><h3>1</h3><h3>2</h3></header>
  <main><p>one</p><p>two<a>slot fail</a></p></main>
</div>
*/
```

Use Cases
-----

`Version`: >= 3.3.0

Slots can be used along with `if` or `for` directives.

### if Directive

In the following example, the unnamed slot won't be rendered since the `hidden` attribute for the panel is set to true. The `.slot()` method returns `0`.

```javascript
var Panel = san.defineComponent({
    template: '<div><slot name="title"/><slot s-if="!hidden"/></div>',
});

var MyComponent = san.defineComponent({
    components: {
      'x-panel': Panel
    },

    template: ''
        + '<div>'
          + '<x-panel hidden="{{folderHidden}}" s-ref="panel">'
              + '<b slot="title">{{name}}</b>'
              + '<p>{{desc}}</p>'
          + '</x-panel>'
        + '</div>',

    attached: function () {
        // 0
        this.ref('panel').slot().length
    }
});


var myComponent = new MyComponent({
    data: {
        folderHidden: true,
        desc: 'MVVM component framework',
        name: 'San'
    }
});

/* Render results for MyComponent, the unnamed slot is not rendered cause hidden is true
<div>
    <b>San</b>
</div>
*/
```

### for Directive

The following case may not be useful, it's only intended to demonstrate how to use slots along with the `for` directive. There's a real world case latter in the **scoped slots** section.

```javascript
var Panel = san.defineComponent({
    template: '<div><slot s-for="item in data"/></div>',
});

var MyComponent = san.defineComponent({
    components: {
      'x-panel': Panel
    },

    template: ''
        + '<div>'
          + '<x-panel data="{{panelData}}" s-ref="panel">'
              + '<p>{{name}}</p>'
          + '</x-panel>'
        + '</div>',

    attached: function () {
        // 0
        this.ref('panel').slot().length
    }
});


var myComponent = new MyComponent({
    data: {
        panelData: [1, 2, 3],
        name: 'San'
    }
});

/* Render results for MyComponent, there's a `<p>{{name}}</p>` repeated 3 times
<div>
    <p>San</p>
    <p>San</p>
    <p>San</p>
</div>
*/
```



Scoped Slots
-----

If there's a **s-bind** attribute or one or more **var-** prefixed attributes specified, the slot is called a scoped slot.

Scoped slot is useful when the contents is expected to be rendered using **external layouts** with internal data.

`Note`: Bi-directional binding is not supported in scoped slots.


### var

`Version`: >= 3.3.0


A **var-** prefixed attribute is set in **var-name="expression"** format.


```javascript
var Men = san.defineComponent({
    template: '<div>'
      + '<slot s-for="item in data" var-n="item.name" var-email="item.email" var-sex="item.sex ? \'male\' : \'female\'">'
        + '<p>{{n}},{{sex}},{{email}}</p>'
      + '</slot>'
      + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-men': Men
    },

    template: '<div><x-men data="{{men}}" s-ref="men">'
          + '<h3>{{n}}</h3>'
          + '<p><b>{{sex}}</b><u>{{email}}</u></p>'
        + '</x-men></div>',

    attached: function () {
        var slots = this.ref('men').slot();

        // 3
        slots.length

        // truthy
        slots[0].isInserted

        // truthy
        contentSlot.isScoped
    }
});

var myComponent = new MyComponent({
    data: {
        men: [
            {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
            {name: 'leeight', sex: 0, email: 'leeight@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
        ]
    }
});

/* Render results for MyComponent
<div>
    <h3>errorrik</h3>
    <p><b>male</b><u>errorrik@gmail.com</u></p>
    <h3>leeight</h3>
    <p><b>female</b><u>leeight@gmail.com</u></p>
    <h3>otakustay</h3>
    <p><b>male</b><u>otakustay@gmail.com</u></p>
</div>
*/
```

### s-bind

`Version`: >= 3.6.0


A **s-bind** attribute is set in **s-bind="expression"** format.

When both **s-bind** and **var-** attributes are set, **var-** attributes will hide the corresponding items in **s-bind**.


```javascript
var Men = san.defineComponent({
    template: '<div>'
      + '<slot s-for="item in data" s-bind="{n: item.name, email: item.email, sex: item.sex ? \'male\' : \'female\'}">'
        + '<p>{{n}},{{sex}},{{email}}</p>'
      + '</slot>'
      + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-men': Men
    },

    template: '<div><x-men data="{{men}}" s-ref="men">'
          + '<h3>{{n}}</h3>'
          + '<p><b>{{sex}}</b><u>{{email}}</u></p>'
        + '</x-men></div>',

    attached: function () {
        var slots = this.ref('men').slot();

        // 3
        slots.length

        // truthy
        slots[0].isInserted

        // truthy
        contentSlot.isScoped
    }
});

var myComponent = new MyComponent({
    data: {
        men: [
            {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
            {name: 'leeight', sex: 0, email: 'leeight@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
        ]
    }
});

/* Render results for MyComponent
<div>
    <h3>errorrik</h3>
    <p><b>male</b><u>errorrik@gmail.com</u></p>
    <h3>leeight</h3>
    <p><b>female</b><u>leeight@gmail.com</u></p>
    <h3>otakustay</h3>
    <p><b>male</b><u>otakustay@gmail.com</u></p>
</div>
*/
```


### Scope Data Access

`Version`: >= 3.3.1

Besides data declared by **var-**, scope data is also available in scoped slots.

- When the default contents is used, the internal scope is available
- When the external contents is used, the external component's scope is available

```javascript
var Man = san.defineComponent({
    template: '<p>'
      +   '<slot var-n="who.name" var-email="who.email">'
      +     '{{n}},{{email}},{{country}}'
      +   '</slot>'
      + '</p>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    template: ''
        + '<div><x-man who="{{man}}" country="{{country}}">'
        +   '<b>{{n}} - {{province}}</b>'
        +   '<u>{{email}}</u>'
        + '</x-men></div>'
});

var myComponent = new MyComponent({
    data: {
        man: {
            name: 'errorrik', 
            email: 'errorrik@gmail.com'
        },
        country: 'China',
        province: 'HN'
    }
});

/* Render results for MyComponent
<div>
    <p>
        <b>errorrik - HN</b>
        <u>errorrik@gmail.com</u>
    </p>
</div>
*/
```


Dynamic Naming
-----

`Version`: >= 3.3.1


Slots can be named using data from the current scope to provide dynamic slots, which is useful in cases when **the layouts are generated from data**, for example, the table components.

```javascript
var Table = san.defineComponent({
    template: ''
        + '<table>'
        +   '<thead><tr><th s-for="col in columns">{{col.label}}</th></tr></thead>'
        +   '<tbody>'
        +     '<tr s-for="row in datasource">'
        +       '<td s-for="col in columns">'
        +         '<slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot>'
        +       '</td>'
        + '    </tr>'
        +   '</tbody>'
        + '</table>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-table': Table
    },

    template: ''
        + '<div>'
        +   '<x-table columns="{{columns}}" datasource="{{list}}">'
        +     '<b slot="col-name">{{row.name}}</b>'
        +   '</x-table>'
        + '</div>'

});

var myComponent = new MyComponent({
    data: {
        columns: [
            {name: 'name', label: 'N'},
            {name: 'email', label: 'E'}
        ],
        list: [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'leeight', email: 'leeight@gmail.com'}
        ]
    }
});

/* Render results for MyComponent
<div>
    <table>
        <thead>
            <tr>
                <th>N</th>
                <th>E</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><b>errorrik</b></td>
                <td>errorrik@gmail.com</td>
            </tr>
            <tr>
                <td><b>leeight</b></td>
                <td>leeight@gmail.com</td>
            </tr>
        </tbody>
    </table>
</div>
*/
```

`Note`: There're compatibility issues with table updating in IE.


