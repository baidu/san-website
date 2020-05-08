---
title: loop
categories:
- tutorial
---

It is a common scenario to render a list via loop. We can render a list by applying the **s-for** directive on the element.


Syntax
----

The syntax of the **s-for** directive is as follows:

```
item-identifier[, index-identifier] in expression[ trackBy accessor-expression]
```

List Rendering
----

The following code describes the use of the **s-for** directive on an element to render a list. Inside the elements rendered by the list, you can access other data on the owner component (dept in the example below).

```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```

Index
----

The index variable name (index in the example below) can be specified in the **s-for** directive to get the index of the list element in the list rendering process.

```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p, index in persons" title="{{p.name}}">{{index + 1}}. {{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```

List data operation
-------

To manipulate list data such as inserting or deleting items, we use the array method provided by the component data. For details, please refer to the [Array Method] (../data-method/#Array-Method) document.


Virtual element
------

Similar to the `if` directive, you can also use a `fragment` element with `for` directive to render a block of multiple elements. For example:


```html
<!-- Template -->
<dl>
    <fragment s-for="p in persons">
        <dt>{{p.name}}</dt>
        <dd>{{p.email}}</dd>
    </fragment>
</dl>
```


`Note`: **fragment** is supported since 3.8.3, for older versions please use **template** instead. The name **fragment** is more consistent with the HTML semantic so it's recommended to upgrade san to the latest version.

trackBy
------

`>= 3.6.1`


Specify **trackBy** in the **s-for** directive declaration. When the array is updated, San will automatically track the changes of the items and perform the corresponding insert/remove operations. **trackBy** can only declare attribute access to item-identifier.


```html
<!-- Template -->
<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons trackBy p.name" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

```js
// Component
san.defineComponent({
    // template

    initData: function () {
        return {
            dept: 'ssg',
            persons: [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        };
    }
});
```


TrackBy is typically used when rendering JSON data returned by the backend. Because the two JSON parse cannot make a === comparison on the list elements, the track will track the changes internally through trackBy. When combined with transitions, the animation of the change process will be more reasonable.

In the following scenario, the performance of using trackBy will be worse:

- All data items have changed
- The order of data items before and after changes is different




