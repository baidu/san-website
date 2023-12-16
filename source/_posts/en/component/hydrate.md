---
title: Component Hydrate
categories:
- component
---


`tips`: The component can be [server-side rendered](../../tutorial/ssr/) in San, and it must be reversed on the browser side with the same version of San.


Overview
----

When the component is initialized, it is passed a **el** argument which will be the root element of the component, and the view structure will be parsed backwards.

The intent of this feature is that sometimes we want the initial view to be direct HTML, rather than being rendered by components. But we want components to manage data, logic, and views for us, and subsequent user interactions and view transformations are managed through components.

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap').firstChild
});
```

When **el** initializes the component, San will respect the current HTML form of **el** and will not perform any additional rendering actions that affect the visual.

- Will not render the view using the default template
- Will not create a root element
- Direct access to compiled, created, attached lifecycle

Data
----

The view of the component is the rendering of the data. We need to mark **data** at the beginning of the component to specify the correct initial data.  The initial data tag is an HTML comment starting with **s-data:**, in which the data is declared.


`warning`：The process of San's `component reversion` is based on data and component templates for view structure backstepping and matching. The reversed component must have the correct tagged data, otherwise, the reverse-parsing process will occur errors. For example, when the view is reversed for the `s-if` condition in the template, there is no correct markup data, and the backstepping will result in undesired outcomes because the elements do not correspond.


```html
<a id="wrap"><!--s-data:{
        email: 'error@gmail.com',
        name: 'errorrik'}-->
    <span title="errorrik@gmail.com">errorrik</span>
</a>
```

```javascript
var MyComponent = san.defineComponent({
    template: ''
        + '<a>\n'
        + '    <span title="{{email}}">{{name}}</span>\n'
        + '</a>'
});

var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```


If a component has owner, there is no need to mark the initial data. Its initial data is populated by the owner based on the binding relationship.


```html
<!-- ui-label a component has owner, there is no need to mark the initial data -->
<div id="main"><!--s-data:{"name":"errorrik"}-->
    <span>errorrik</span>
</div>
```

```javascript
var Label = san.defineComponent({
    template: '<span>{{text}}</span>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: ''
        + '<div>\n'
        + '    <ui-label text="{{name}}"></ui-label>\n'
        + '</div>'
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```


Composite interpolation text
----

San supports direct output of HTML in an interpolated text. In this case, the interpolated text corresponds to not a TextNode but may be multiple different types of elements. For this composite interpolated text, you need to add a comment before and after the content to mark it.

- The comment before the text is **s-text**, which means the start of an interpolated text fragment.
- The comment after the text is **/s-text**, which means the end of an interpolated text fragment.

```html
<a id="wrap"><!--s-data:{
        name: 'new <b>San</b>'}-->
    <span>Hello <!--s-text-->new <b>San</b><!--/s-text-->!</span>
</a>
```

```javascript
var MyComponent = san.defineComponent({
    template: ''
        + '<a>\n'
        + '    <span>Hello {{name|raw}}!</span>\n'
        + '</a>'
});

var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```
