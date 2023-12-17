---
title: Component View
categories:
- component
---

## Component Template

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

## Filter

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


## slot

The position of a slot can be declared in the view template by slot, the content of which can be defined by the outer component. Refer to the [slot](../../tutorial/slot/) document for more details.

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


## el


The properties of the component instance **el** represents the HTML element of the component, which can be passed in via `option` when the component is initialized.

Most of the time you don't need to care about it when writing components. But if you pass **el** when you initialize the component, it means that the component has this element as the component root element. And the element will:

- not render the view using the default template
- not create a root element
- directly call compiled, created, attached lifecycle

Sometimes we want the initial view to be direct HTML for the first time, not by the component rendering. But at the same time, we want components to manage data, logic, and views for us, as well as subsequent user interactions and view transformations through component management. In this case, you can pass in an existing element via **el**.

The component will take the element passed in by **el** as the component root element and parse out the view structure. This process is called **component reversal**. Refer to the [component reversal](../reverse/) document for more.


