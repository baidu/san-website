---
title: 组件
categories:
- component
---

定义组件最基本的方法是，从 **san.Component** 继承。San 提供了 **san.inherits** 方法，用于继承。

```javascript
function MyApp(options) {
    san.Component.call(this, options);
}
san.inherits(MyApp, san.Component);

MyApp.prototype.template = '<ul><li s-for="item in list">{{item}}</li></ul>';

MyApp.prototype.attached = function () {
    this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
};
```

然后，通过 new 的方式就可以使用这个组件了。当然，通常你可能希望让组件出现在页面上，所以需要调用 attach 方法，将组件添加到页面的相应位置。


```javascript
var myApp = new MyApp();
myApp.attach(document.body);
```

通过继承的方式定义组件的好处是，当你使用 ESNext 时，你可以很自然的 extends。

`注意`：由于 ESNext 没有能够编写 prototype 属性的语法，所以 San 对组件定义时的属性支持 static property。通过 ESNext 的 extends 继承时，template / filters / components 属性请使用 static property 的方式定义。

```javascript
import {Component} from 'san';

class HelloComponent extends Component {

    constructor(options) {
        super(options);
        // .....
    }

    static template = '<p>Hello {{name}}!</p>';

    initData() {
        return {name: 'San'}
    }
}

new HelloComponent().attach(document.body);
```

对于不使用 ESNext 时，写一个 function 然后调用 **san.inherits** 再写各种 prototype 实在是有点麻烦，San 提供了快捷方法 **san.defineComponent** 用于方便地定义组件。

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});
```