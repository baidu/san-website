---
title: Define Component
categories:
- component
---

The most basic way to define a component is to inherit from **san.Component**. San also provides the **san.inherits** method for inheritance.

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

Then you can use this component by creating an instance with 'new' method. Obviously, if you want the component to appear on the page, you need to call the attach method to render the component inside root DOM.

```javascript
var myApp = new MyApp();
myApp.attach(document.body);
```

The advantage of defining components in an inherited way is that when you use ESNext, you can naturally use **extends**.

`tips`: Since ESNext itself does not support overwriting prototype, San supports the static property. You should define template/filters/components properties as static property when use extends a component in ESNext.

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

When defining a component in non-ESNext way, it is boring to create a function, call **san.inherits** and define various prototypes. San provides a shortcut method **san.defineComponent** to make it easy.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});
```