---
title: 主模块API
categories:
- doc
---


组件初始化
-------

### defineComponent

`描述`： defineComponent({Object}propertiesAndMethods)

`解释`：

**方法** 。定义组件的快捷方法。详细请参考[组件定义](../../tutorial/component/#组件定义)文档。

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


### compileComponent

`版本`：>= 3.3.0

`描述`： {void} compileComponent({Function}ComponentClass)

`解释`：

**方法** 。编译组件，组件的编译过程主要是解析 template 成 [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)，并对 components 中的 plain object 执行 defineComponent。

组件会在其第一个实例初始化时自动编译。我们通常不会使用此方法编译组件，除非你有特殊的需求希望组件的编译过程提前。

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

typeof MyApp.prototype.aNode // undefined
san.compileComponent(MyApp);
typeof MyApp.prototype.aNode // object
```


### Component

`类型`： Function

`解释`：

**属性** 。组件类，定义组件时可以从此继承。通常通过 **san.defineComponent** 定义组件，不使用此方法。详细请参考[组件定义](../../tutorial/component/#组件定义)文档。

`用法`：

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

`描述`： inherits({Function}SubClass, {Function}SuperClass)

`解释`：

**方法** 。一个通用的实现继承的方法，定义组件时可以使用此方法从 **san.Component** 继承。通常在 ES5 下通过 **san.defineComponent** 定义组件，在 ESNext 下使用 **extends** 定义组件。

绝大多数情况不推荐使用此方法。详细请参考[组件定义](../../tutorial/component/#组件定义)文档。


服务端渲染
------

### compileToRenderer

`版本`：>= 3.1.0

`描述`： {function(Object):string} compileToRenderer({Function}ComponentClass)

`解释`：

**方法** 。将组件类编译成 renderer 方法。详细请参考[服务端渲染](../../tutorial/ssr/#输出HTML)文档。

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

var render = san.compileToRenderer(MyApp);
```

### compileToSource

`版本`：>= 3.1.0

`描述`： {string} compileToRenderer({Function}ComponentClass)

`解释`：

**方法** 。将组件类编译成 renderer 方法的源文件。详细请参考[服务端渲染](../../tutorial/ssr/#编译NodeJS模块)文档。

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

var renderSource = san.compileToSource(MyApp);
fs.writeFileSync('your-module.js', 'exports = module.exports = ' + renderSource, 'UTF-8');
```


模板编译
------

### ExprType

`版本`：>= 3.0.3

`类型`： Object

`解释`：

**属性** 。表达式类型枚举，有助于帮你理解和使用 San 的模板编译结果。详细请参考[ANode](https://github.com/baidu/san/blob/master/doc/anode.md)文档。


### parseExpr

`版本`：>= 3.0.3

`描述`： {Object} parseExpr({string}source)

`解释`：

**方法** 。将源字符串解析成表达式对象。详细请参考[ANode](https://github.com/baidu/san/blob/master/doc/anode.md)文档。

`用法`：

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

`版本`：>= 3.0.3

`描述`： {ANode} parseTemplate({string}source)

`解释`：

**方法** 。将源字符串解析成 ANode 对象。如果你想使用 San 的模板形式，但是自己开发视图渲染机制，可以使用该方法解析模板。详细请参考[ANode](https://github.com/baidu/san/blob/master/doc/anode.md#user-content-%E6%A8%A1%E6%9D%BF%E8%A7%A3%E6%9E%90%E7%BB%93%E6%9E%9C)文档。

`用法`：

```javascript
var aNode = san.parseTemplate('<p>Hello {{name}}!</p>');
/*
aNode = {
    "directives": [],
    "props": [],
    "events": [],
    "children": [
        {
            "isText": true,
            "text": "Hello {{name}}!",
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "Hello "
                    },
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.ACCESSOR,
                            "paths": [
                                {
                                    "type": ExprType.STRING,
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
*/
```


其他
----

### debug

`类型`： boolean

`解释`：

**属性** 。是否开启调试功能。当同时满足以下两个条件时，可以在 chrome 中使用 **devtool** 进行调试。

- 主模块 **debug** 属性设为 **true**
- 当前页面环境中的 San 是带有 **devtool** 功能的版本。[查看San的打包发布版本](https://github.com/baidu/san/tree/master/dist)


### version

`类型`： string

`解释`：

**属性** 。当前的 San 版本号。


### LifeCycle

`版本`： < 3.3.0 (已废弃)

`类型`： Function

`解释`：

**属性** 。生命周期类。如果你想自己开发管理组件的渲染和交互更新过程，LifeCycle 可能对你有所帮助。

LifeCycle 定义了以下生命周期，并且生命周期之间包含互斥关系，描述如下：

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

通过 LifeCycle 的 set 方法，可以指定生命周期； 通过 LifeCycle 的 is 方法，可以判断是否处于生命周期。

`用法`：

```javascript
var lifeCycle = new san.LifeCycle();

lifeCycle.set('attached');
lifeCycle.is('attached'); // true

lifeCycle.set('detached');
lifeCycle.is('attached'); // false
```

