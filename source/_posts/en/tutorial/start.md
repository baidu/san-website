---
title: Start
categories:
- tutorial
---

San is an MVVM component-based framework. Its compact size (< 17K), good compatibility (supports IE6), and excellent performance make it a reliable solution for implementing responsive user interfaces.

San declaratively renders data to the DOM using an HTML-based template syntax. In the process, San compiles string-based templates to [ANode](https://github.com/baidu/san/blob/master/doc/anode.md), builds UI view instantly by high-performance view engine. Apart from raw HTML features, all San templates implement HTML-data binding, and usual syntaxes such as branching, loop, etc. Combined with the reactivity system(two-way binding and [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)), San is able to intelligently figure out the minimal number of components to re-render asynchronously and apply the minimal amount of DOM manipulations when the app state changes.

Component, the basic unit of San, is an independent unit of data, logic, and view. From a page perspective, a component is an extension of an HTML element; from a functional mode perspective, a component is a ViewModel. San components provide a complete lifecycle, which is part of the Web Components Spec. Also, San components can be tree-nested and communicated with each other via cross-component data flow. Therefore, San's component mechanism can effectively support the componentization requirements of business development.

Based on the [component reversion](https://baidu.github.io/san/tutorial/reverse/), San provides server side rendering features through which we can create SEO friendly apps with faster initial page rendering and other pros compared with pure client side rendering. Meanwhile, the ecosystem of San offer a series of modern tooling and supporting libraries. In short, San is perfectly capable of powering large-scaled maintainable Single-Page Applications.

The easiest way to try out San is using some simple [examples]. Now, Here we go.

Hello
-------

```javascript
var MyApp = san.defineComponent({
    template: '<p>Hello {{name}}!</p>',

    initData: function () {
        return {
            name: 'San'
        };
    }
});


var myApp = new MyApp();
myApp.attach(document.body);
```

We create our San app following steps below:

1. First, we define a San component that specifies the component's **content template** and **initial data** .
2. Initialize the component object.
3. Attach the component to a HTML element to render.


`tips`：It is unfriendly for maintenance to write HTML snippets in JavaScript. We can manage it through WebPack, AMD plugin, asynchronous request, etc. The example here is for convenience.

List rendering
--------

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});

var myApp = new MyApp();
myApp.attach(document.body);
```

We can use the **for** directive to render a list of items based on an array. Here is a usual practice: inject data in **attached** lifecycle method to re-render. For we can initiate a request to get data and update the data in **attached** after the request returns.

Two-way binding
--------

```javascript
var MyApp = san.defineComponent({
    template: ''
        + '<div>'
        +   '<input value="{= name =}" placeholder="please input">'
        +   'Hello {{name}}!'
        + '</div>'
});

var myApp = new MyApp();
myApp.attach(document.body);
```

In this case, We use the **{= expression =}** directive to create two-way data bindings on the input element. It automatically picks the correct way to update the element based on the input.
