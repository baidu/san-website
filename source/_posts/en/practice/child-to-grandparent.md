---
title: How child components communicate with higher layer components
categories:
- practice
---

#### usage

The child component dispatches messages to the upper layer of the component tree via the **dispatch** method.


```javascript
class Son extends san.Component {
    static template = `
        <div>
            <button on-click='onClick'>pass up</button>
        </div>
    `;

    onClick() {
        const value = this.data.get('value');
        // Distribute messages to the upper level of the component tree
        this.dispatch('son-clicked', value);
    }
};
```

The message will be passed up the component tree until it encounters the first component that processes the message. Use **messages** to declare the message the component will process. **messages** is an object, the key is the name of a message, and value is the processing function of a message, which receives an object parameter containing `target` (the component that dispatches the message) and `value`(the value of the message).

```javascript
class GrandParent extends san.Component {
    static template = '<div><slot></slot></div>';

    // Declare messages that the component will process
    static messages = {
        'son-clicked': function (arg) {
            // arg.target can get the component dispatched by the message
            // arg.value can get the value of the message
            this.data.set('value', arg.value);

        }
    }
};
```

#### examples

<p data-height="265" data-theme-id="0" data-slug-hash="oeBmvZ" data-default-tab="js,result" data-user="jiangjiu8357" data-embed-version="2" data-pen-title="higher-communication" class="codepen">See the Pen <a href="https://codepen.io/jiangjiu8357/pen/oeBmvZ/">higher-communication</a> by Swan (<a href="https://codepen.io/jiangjiu8357">@jiangjiu8357</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
