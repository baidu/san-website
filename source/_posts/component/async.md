---
title: 异步组件
categories:
- component
---


`版本`：>= 3.7.0

[createComponentLoader](../../doc/main-members/#createComponentLoader) 方法返回一个组件加载器。components 中的声明为组件加载器时，将进行异步渲染：在 attach 过程中将不渲染该组件，组件将在加载完成后进行渲染。异步渲染有如下特性：

- 对同一个[createComponentLoader](../../doc/main-members/#createComponentLoader) 方法返回的组件加载器，只会进行一次加载。换句话说，load 方法只会调用一次
- 组件的渲染一定是异步的。即使组件加载器当前已经完成加载，也会在主体渲染完成后的下一个 macro task，进行异步组件渲染


[createComponentLoader](../../doc/main-members/#createComponentLoader) 方法可以接受一个返回 Promise 的函数，加载完成后，使用组件类 resolve。

```javascript
var InputComponent = san.defineComponent({
    template: '<input type="text" value="{{value}}"/>'
});

// 模拟加载，1秒后加载完成
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

通常情况，需要异步加载的组件都会有一定的复杂度。如果期望在加载过程中显示简单的替代视图，可以传入一个 Object 给 [createComponentLoader](../../doc/main-members/#createComponentLoader) 方法，通过 load 属性传入加载方法，并指定一个 placeholder 组件。

```javascript
var InputComponent = san.defineComponent({
    template: '<input type="text" value="{{value}}"/>'
});

var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// 模拟加载，1秒后加载完成
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

你可以指定一个 fallback 组件，用于加载失败时使用的视图组件。但是，标识失败需要你 reject 返回的 Promise。

```javascript
var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// 模拟加载，1秒后加载完成
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

加载失败时使用的视图组件，除了通过 fallback 指定，也可以通过 reject 指定。

```javascript
var LabelComponent = san.defineComponent({
    template: '<u>{{value}}</u>'
});

// 模拟加载，1秒后加载完成
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