---
title: San API
categories:
- doc
---


Component Initialization
-------

### defineComponent

`Description`: defineComponent({Object}propertiesAndMethods)

`Explanation`:

**Method**. A shortcut to define components. Refer to [Component Definition](../../tutorial/component/#component-definition) for details.

`Usage`:

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


### compileComponent

`Version`: >= 3.3.0 & < 3.9.0

`Description`: {void} compileComponent({Function}ComponentClass)

`Explanation`:

**Method**. Compile a component. The compilation mainly consists of parsing the template into [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)s and call `.defineComponent()` for plain object within the component.

Components will compile automatically on its first instantiation. Typically you won't need to call this API to compile components manually, but it's provided anyway in case you need ahead-of-time compilation.

`Usage`:

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});

typeof MyApp.prototype.aNode // undefined
san.compileComponent(MyApp);
typeof MyApp.prototype.aNode // object
```


### Component

`Type`: Function

`Explanation`:

**Property**. The component class, from which the newly defined components will inherit. For most cases the **san.defineComponent** method should be used instead. Refer to [Component Definition](../../tutorial/component/#component-definition) for details.

`Usage`:

```javascript
import {Component} from 'san';

class HelloComponent extends Component {

    static template = '<p>Hello {{name}}!</p>';

    initData() { 
        return {name: 'San'} 
    }
}
```


### inherits

`Description`: inherits({Function}SubClass, {Function}SuperClass)

`Explanation`:

**Method**. An util method to implement inheritance, which is the case when defining components (inherit from **san.Component**). Usually, to define a component we use **san.defineComponent** in ES5 and **extends** in ESNext.

It is not recommended to use `.inherits()` in most cases. Refer to [Component Definition](../../tutorial/component/#component-definition) for details.


Server-Side Rendering
------

### compileToRenderer

`Version`:>= 3.1.0

`Description`: {function(Object):string} compileToRenderer({Function}ComponentClass)

`Explanation`:

**Method**. Compile a component class into a renderer method. Refer to [Server-Side Rendering](../../tutorial/ssr/#output-HTML) for details.

`Usage`:

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});

var render = san.compileToRenderer(MyApp);
```

### compileToSource

`Version`:>= 3.1.0

`Description`: {string} compileToRenderer({Function}ComponentClass)

`Explanation`:

**Method**. Compile a component class into a source file containing the renderer method. Refer to [Server-Side Rendering](../../tutorial/ssr/#compiling-nodejs-modules) for details.

`Usage`:

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});

var renderSource = san.compileToSource(MyApp);
fs.writeFileSync('your-module.js', 'exports = module.exports = ' + renderSource, 'UTF-8');
```


Template Compilation
------

### ExprType

`Version`:>= 3.0.3

`Type`: Object

`Explanation`:

**Property**. An enum value representing the expression type, which helps to understand and use the compile output produced by San. Refer to [ANode](https://github.com/baidu/san/blob/master/doc/anode.md) for details.


### parseExpr

`Version`:>= 3.0.3

`Description`: {Object} parseExpr({string}source)

`Explanation`:

**Method**. Parse the source string into an expression object. Refer to [ANode](https://github.com/baidu/san/blob/master/doc/anode.md) for details.

`Usage`:

```javascript
var expr = san.parseExpr('!user.isLogin');
/*
expr = {
    type: ExprType.UNARY,
    expr: {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: 'user'},
            {type: ExprType.STRING, value: 'isLogin'}
        ]
    }
}
*/
```

### parseTemplate

`Version`:>= 3.0.3

`Description`: {ANode} parseTemplate({string}source)

`Explanation`:

**Method**. Parse the source string into an ANode object. The San template engine can be reused via this method. Refer to [ANode](https://github.com/baidu/san/blob/master/doc/anode.md#user-content-%E6%A8%A1%E6%9D%BF%E8%A7%A3%E6%9E%90%E7%BB%93%E6%9E%9C) for details.

`Usage`:

```javascript
var aNode = san.parseTemplate('<p>Hello {{name}}!</p>');
/*
aNode = {
    "directives": {},
    "props": [],
    "events": [],
    "children": [
        {
            "directives": {},
            "props": [],
            "events": [],
            "children": [
                {
                    "textExpr": {
                        "type": 7,
                        "segs": [
                            {
                                "type": 1,
                                "value": "Hello "
                            },
                            {
                                "type": 5,
                                "expr": {
                                    "type": 4,
                                    "paths": [
                                        {
                                            "type": 1,
                                            "value": "name"
                                        }
                                    ]
                                },
                                "filters": []
                            }
                        ]
                    }
                }
            ],
            "tagName": "p"
        }
    ]
}
*/
```


Data
----

Data container and expression evaluator in San components are also exposed. These classes can be useful to handle component-independent data such as application state.


### Data

`Version`:>= 3.5.6

`Type`: Class Function

`Explanation`:

**Data Container** provides get, set, splice, push, pop, unshift, shift, merge and apply methods. Refer to [Data Manipulation](../../tutorial/data-method/) for details.

`change` event is fired when the data is changed via data manipulation methods. Handlers for the `change` event can be registered and unregistered via `listen` and `unlisten` methods respectively.

```javascript
var data = new san.Data({
    num1: 1,
    num2: 2
});

data.listen(function (change) {
    console.log(change.value);
});

data.set('num2', 10);
// console 10
```


### evalExpr

`Version`:>= 3.5.6

`Description`: {*} evalExpr({Object}expr, {Data}data, {Component=}owner)


`Explanation`:

**Method** is used to evaluate the value of an expression. 

- `expr` can be obtained via [parseExpr](#parseExpr) method. For the supported expression types, refer to [Expression](../../tutorial/template/#expressions)
- `data` can be either component's data object, or any data object obtained by new [Data](#Data)
- `owner` is used for evaluating filters in the expression, required when there're custom filters in the expression, optional otherwise.


```javascript
var data = new san.Data({
    num1: 1,
    num2: 2
});

san.evalExpr(san.parseExpr('num1 + num2'), data)
// console 3
```


Others
----

### debug

`Type`: boolean

`Explanation`:

**Property**. Whether or not to enable debug functionalities. Before using Chrome **DevTools** to debug your San application, make sure the following conditions are matched:

- the **debug** property of San module is set to **true**
- the San loaded in the current page is built with **DevTools** functionality. Refer to [San releases](https://github.com/baidu/san/tree/master/dist) for details


### version

`Type`: string

`Explanation`:

**Property**. The San version number.


### LifeCycle

`Version`: < 3.3.0 (deprecated)

`Type`: Function

`Explanation`:

**Property**. Lifecycle Class is useful when you need to render and update components manually.

LifeCycle defines the following lifecycle states, some of which are mutually exclusive. In detail:

```
{
    compiled: {
        value: 1
    },

    inited: {
        value: 2
    },

    created: {
        value: 3
    },

    attached: {
        value: 4,
        mutex: 'detached'
    },

    detached: {
        value: 5,
        mutex: 'attached'
    },

    disposed: {
        value: 6,
        mutex: '*'
    }
}
```

The current state can be set via the `.set()` method of LifeCycle class, and can be tested via the `is` method.

`Usage`:

```javascript
var lifeCycle = new san.LifeCycle();

lifeCycle.set('attached');
lifeCycle.is('attached'); // true

lifeCycle.set('detached');
lifeCycle.is('attached'); // false
```

