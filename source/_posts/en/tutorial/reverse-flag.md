---
title: component reversed parsing（old）
categories:
- tutorial
---

**This document was deprecated. The new component reverses mechanism is based on data and template matching instead of the original markup mechanism.**

`version`：< 3.4.0

`hint`：With [Server Rendering] (../ssr/) via San, you can definitely reverse the browser side with the same version of San.


Overview
-----

When the component is initialized, it is passed to **el** element, which will be the root element of the component, and the view structure will be parsed backwards.

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

However, **el** may require some additional markup to help San understand the structure of data and views (interpolation, bindings, loops, branches, components, etc.) for subsequent behavior management and view refresh.

Data and views are an important part of the component, and we will explain the reverse function of the component from these two aspects.

`Hint`: If you use NodeJS as the server, San provides support for [server-side rendering] (../ssr/), which can naturally output HTML that can be reversed by the component. You don't need to know the tag of component resolving form. If your server uses a different language (such as PHP), please read on.


View
----

This section describes how to mark the structure of the view (interpolation, binding, loops, branches, components, etc).

### Interpolated text

Interpolated text is marked by adding a comment before and after the text.

- The comment before the text begins with **s-text:** followed by the declaration of the interpolated text.
- The comment content after the text is **/s-text**, which means the end of the interpolated text fragment.

```html
<span><!--s-text:{{name}} - {{email}}-->errorrik - errorrik@gmail.com<!--/s-text--></span>
```

`Hint`: **s- \[html comment\]** at the beginning is an important tagging method, and it is also used in loops and branch tags.


### Interpolated props

The interpolation props is marked by: Declaring the content of the attribute on the attribute whose **prop-** is prefixed.

```html
<span title="errorrik - errorrik@gmail.com" prop-title="{{name}} - {{email}}"></span>
```

### Bindings

The binding attribute is marked exactly the same as the interpolation attribute: the content of the attribute is declared on the attribute whose **prop-** is prefixed.

```html
<ui-label prop-title="{{name}}" prop-text="{{jokeName}}"></ui-label>
```

Two-way binding is in the form of **{= expression =}**.

```html
<input prop-value="{=name=}" value="errorrik">
```


### Loops

For loops, we need to mark the **start** and **end** of the loop with the stub element.

```html
<ul id="list">
    <!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
    <li prop-title="{{p.name}}" title="errorrik"><!--s-text:{{p.name}} - {{p.email}}-->errorrik - errorrik@gmail.com<!--/s-text--></li>
    <li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
    <!--/s-for-->
</ul>
```

**The start** stub element tag is an HTML comment that begins with **s-for:**, followed by the tag content that declares the loop.


```html
<!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
```

**The End** sub element tag is an HTML Comment with the content **/s-for**.

```html
<!--/s-for-->
```

For each element of the loop, mark it as a normal element without marking the **for** directive. Usually they also exist in a loop on the HTML output, without the burden of rewriting.

```html
<li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
```

`Hint`: When there is no data at the beginning, the markup loop only needs to declare **start** and **end**.


### Branch

The branch tag is simpler, and the branch element can be marked with **s-if**.

```html
<span s-if="condition" title="errorrik" prop-title="{{name}}"></span>
```

When the initial condition is false, the branch element does not appear. At this time, the branch is marked with **HTML Comment**. A statement that declares a branch inside the pile.

```html
<!--s-if:<span s-if="cond" title="{{name}}">{{name}}</span>--><!--/s-if-->
```

A branch that contains a complete if-else, there is always one element that is a concrete element, and one element that is a stub.

```html
<!--s-if:<span s-if="isErik" title="{{name}}">{{name}}</span>--><!--/s-if-->
<span s-else title="otakustay" prop-title="{{name2}}"><!--s-text:{{name2}}-->otakustay<!--/s-text--></span>
```

```html
<span s-if="isErik" title="errorrik" prop-title="{{name}}"><!--s-text:{{name}}-->errorrik<!--/s-text--></span>
<!--s-else:<span s-else title="{{name2}}">{{name2}}</span>--><!--/s-else-->
```


### Component

```javascript
san.defineComponent({
    components: {
        'ui-label': Label
    }
});
```

The markup of the component is the same as the declaration in the view template, marking the binding on the corresponding custom element. San will automatically identify the component based on the label of the custom element.

```html
<ui-label prop-title="{{name}}" prop-text="{{email}}">
    <b prop-title="{{title}}" title="errorrik"><!--s-text:{{text}}-->errorrik@gmail.com<!--/s-text--></b>
</ui-label>
```

We may not want to use custom elements for style, compatibility, etc. When a component does not use a custom element, you can mark the component type with **s-component** on the element.

```html
<label s-component="ui-label" prop-title="{{name}}" prop-text="{{email}}">
    <b prop-title="{{title}}" title="errorrik"><!--s-text:{{text}}-->errorrik@gmail.com<!--/s-text--></b>
</label>
```

### slot

The slot's tag is similar to the loop, we need to mark the loop's **start** and **end** with the stub element.

```html
<div id="main">
    <!--s-data:{"tabText":"tab","text":"one","title":"1"}-->
    <div s-component="ui-tab" prop-text="{{tabText}}">
        <div prop-class="head" class="head">
            <!--s-slot:title-->
            <h3 prop-title="{{title}}" title="1"><!--s-text:{{title}}-->1<!--/s-text--></h3>
            <!--/s-slot-->
        </div>
        <div>
            <!--s-slot-->
            <p prop-title="{{text}}" title="one"><!--s-text:{{text}}-->one<!--/s-text--></p>
            <!--/s-slot-->
        </div>
    </div>
</div>
```

```javascript
var Tab = san.defineComponent({
    template: [
        '<div>',
        '    <div class="head"><slot name="title"></slot></div>',
        '    <div><slot></slot></div>',
        '</div>'
    ].join('\n')
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: [
        '<div><ui-tab text="{{tabText}}">',
        '    <h3 slot="title" title="{{title}}">{{title}}</h3>',
        '    <p title="{{text}}">{{text}}</p>',
        '</ui-tab></div>'
    ].join('\n')
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```


**The start** element's stub element tag is an HTML Comment starting with **s-slot:** followed by the slot name.


```html
<!--s-slot:title-->
```

**The end** element's stub elements tag is an HTML Comments with the content **/s-slot**.


```html
<!--/s-slot-->
```

When the owner does not give the content, the content of the slot is the default content declared in the component, and the environment inside the slot is the environment inside the component, not the environment outside the component. For the default content, you need to add a **!** declaration before the pile element name of the **start**.

```html
<!--s-slot:!title-->
```



Data
----

The view of the component is the rendering of the data. We need to specify the correct initial data by marking **data** at the beginning of the component. The initial data tag is an HTML Comment starting with **s-data:**, in which the data is declared.

```html
<div id="wrap">
    <!--s-data:{
        email: 'error@gmail.com',
        name: 'errorrik'
    }-->
    <span title="errorrik@gmail.com" prop-title="{{email}}"><!--s-text:{{name}}-->errorrik<!--/s-text--></span>
</div>
```

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```

`Warning`: If the HTML contains only view results and no data, the component cannot parse its representative data from the view's DOM structure, which may cause undesired consequences in subsequent operations.

For example, for the list data, the data should be consistent with the view at the time of initialization, because the complicated operations such as adding and deleting the list are closely related to the view update. If the initial correspondence is not matched, the view update may produce unpredictable results.

```html
<ul id="list">
    <li>name - email</li>
    <!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
    <li prop-title="{{p.name}}" title="errorrik"><!--s-text:{{p.name}} - {{p.email}}-->errorrik - errorrik@gmail.com<!--/s-text--></li>
    <li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
    <!--/s-for-->
</ul>
```

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('list')
});

// component does not contain initial data tag
// The following statement will cause an error
myComponent.data.removeAt('persons', 1);
```

`Hint`: If a component has owner, you can not mark the initial data. Its initial data is populated by the owner based on the binding relationship.

```html
<!-- the ui-label component has owner and does not require initial data tagging -->
<div id="main">
    <!--s-data:{"name":"errorrik"}-->
    <span s-component="ui-label" prop-text="{{name}}"><!--s-text:{{text}}-->errorrik<!--/s-text--></span>
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

    template: '<div><ui-label text="{{name}}"></ui-label></div>'
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```

