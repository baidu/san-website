---
title: Async Component
categories:
- component
---

`Version`：>= 3.7.0

[createComponentLoader](../../doc/main-members/#createComponentLoader) function returns a component loader. When a component loader is specified in `components`, the component will be loaded asynchronously: the target component will not be rendered during attaching, instead it'll be rendered after. The features of asynchronous components include:

- Each loader returned by [createComponentLoader](../../doc/main-members/#createComponentLoader) will be loaded only once. In other words, the `load` method will be called only once.
- The target component is ensured to be rendered asynchronously. Even if the loading has already completed, the target component rendering will still be queued as a macro task after the current component finished rendering.


[createComponentLoader](../../doc/main-members/#createComponentLoader) accepts an asynchronous function as its argument, in which case the returned Promise should be resolved as a component class.

```javascript
var InputComponent = san.defineComponent({
    template: '<input type="text" value="{{value}}"/>'
});

// simulate the loading process, will be resolved in 1 second
var inputLoader = san.createComponentLoader(function () {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(InputComponent);
        }, 1000);
    });
});

var MyApp = san.defineComponent({
    components: {
        'x-input': inputLoader
    },

    template: '<div><x-input value="{{name}}"/></div>'
});

var myApp = new MyApp({
    data: {
        name: 'San'
    }
});
myApp.attach(document.body);
```

Typically, asynchronous components all have a certain complexity. We can specify a placeholder to be shown while the component is loading. In this case, pass an object with a `load` property specifying the loader function and a `placeholder` property specifying the placeholder component to the [createComponentLoader](../../doc/main-members/#createComponentLoader) function.

```javascript
var InputComponent = san.defineComponent({
    template: '<input type="text" value="{{value}}"/>'
});

var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// simulate the loading process, will be resolved in 1 second
var inputLoader = san.createComponentLoader({
    load: function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(InputComponent);
            }, 1000);
        });
    },

    placeholder: LabelComponent
});

var MyApp = san.defineComponent({
    components: {
        'x-input': inputLoader
    },

    template: '<div><x-input value="{{name}}"/></div>'
});

var myApp = new MyApp({
    data: {
        name: 'San'
    }
});
myApp.attach(document.body);
```

And a `fallback` component can be specified in case of load failure. Remember to `reject` the Promise if it fails.

```javascript
var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// simulate the loading process, will be resolved in 1 second
var inputLoader = san.createComponentLoader({
    load: function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject();
            }, 1000);
        });
    },

    fallback: LabelComponent
});

var MyApp = san.defineComponent({
    components: {
        'x-input': inputLoader
    },

    template: '<div><x-input value="{{name}}"/></div>'
});

var myApp = new MyApp({
    data: {
        name: 'San'
    }
});
myApp.attach(document.body);
```

The fallback component can also be specified dynamically by the loader. Simply reject the Promise with a component class.

```javascript
var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// simulate the loading process, will be resolved in 1 second
var inputLoader = san.createComponentLoader(function () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(LabelComponent);
        }, 1000);
    });
});

var MyApp = san.defineComponent({
    components: {
        'x-input': inputLoader
    },

    template: '<div><x-input value="{{name}}"/></div>'
});

var myApp = new MyApp({
    data: {
        name: 'San'
    }
});
myApp.attach(document.body);
```
