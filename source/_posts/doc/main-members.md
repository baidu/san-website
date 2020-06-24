---
title: 主模块API
categories:
- doc
---


组件初始化
-------

### defineComponent

`描述`： {Function} defineComponent({Object}propertiesAndMethods)

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

### createComponentLoader

`版本`：>= 3.7.0

`描述`： {Object} createComponentLoader({Object|Function}options)

`解释`：

**方法** 。创建组件 Loader，主要应用于子组件的后加载与异步渲染，详细请参考 [异步组件](../../tutorial/component/#异步组件) 文档。 options 参数为 Object 类型时，支持如下成员：

- {function():Promise}options.load : load 方法。该方法需要返回一个 Promise，load 完成时 reslove，由框架自动调用
- {Function=}options.placeholder : loading 过程中渲染的占位组件
- {Function=}options.fallback : load 失败时渲染的组件

options 参数为 Function时，代表 load 方法。不需要指定 placeholder 和 fallback 时，直接传入 load 方法会更方便。


`用法`：

```javascript
var InputComponent = san.defineComponent({
    template: '<input type="text" value="{{value}}"/>'
});

var MyApp = san.defineComponent({
    components: {
        // component loader 示例，1秒后渲染 x-input
        'x-input': san.createComponentLoader(function () {
            return new Promise(function (resolve) {
                
                setTimeout(function () {
                    resolve(InputComponent);
                }, 1000);
            });
        })
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


数据
----

San 开放了组件中使用的数据容器类与表达式计算函数，开发者可以用来管理一些与组件无关的数据，比如应用状态等。


### Data

`版本`：>= 3.5.6

`类型`： Class Function

`解释`：

**数据容器类** ，包含 get、set、splice、push、pop、unshift、shift、merge、apply 数据方法，详细请参考[数据操作](../../tutorial/data-method/)文档。

通过方法变更数据时，data 对象将 fire change 事件。通过 listen 和 unlisten 方法可以监听或取消监听 change 事件。

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

`版本`：>= 3.5.6

`描述`： {*} evalExpr({Object}expr, {Data}data, {Component=}owner)


`解释`：

**方法** ，计算表达式的值。 

- `expr` 可以通过 [parseExpr](#parseExpr) 方法得到。支持的表达式类型可参考[表达式](../../tutorial/template/#表达式)文档
- `data` 可以是组件的数据对象，也可以是自己通过 new [Data](#Data) 得到的数据对象
- `owner` 仅用于表达式中 filter 的执行，表达式中无自定义 filter 时无需此参数


```javascript
var data = new san.Data({
    num1: 1,
    num2: 2
});

san.evalExpr(san.parseExpr('num1 + num2'), data)
// console 3
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

