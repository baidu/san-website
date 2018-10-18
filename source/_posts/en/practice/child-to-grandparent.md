---
title: 子组件与更高层组件如何通信？
categories:
- practice
---

#### 使用

子组件通过**dispatch**方法向组件树上层派发消息。


```javascript
class Son extends san.Component {
    static template = `
        <div>
            <button on-click='onClick'>向上传递</button>
        </div>
    `;

    onClick() {
        const value = this.data.get('value');
        // 向组件树的上层派发消息
        this.dispatch('son-clicked', value);
    }
};
```

消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件，则停止。通过 **messages** 可以声明组件要处理的消息。**messages** 是一个对象，key 是消息名称，value 是消息处理的函数，接收一个包含 target(派发消息的组件) 和 value(消息的值) 的参数对象。

```javascript
class GrandParent extends san.Component {
    static template = '<div><slot></slot></div>';

    // 声明组件要处理的消息
    static messages = {
        'son-clicked': function (arg) {
            // arg.target 可以拿到派发消息的组件
            // arg.value 可以拿到派发消息的值
            this.data.set('value', arg.value);

        }
    }
};
```

#### 示例

<p data-height="265" data-theme-id="0" data-slug-hash="oeBmvZ" data-default-tab="js,result" data-user="jiangjiu8357" data-embed-version="2" data-pen-title="higher-communication" class="codepen">See the Pen <a href="https://codepen.io/jiangjiu8357/pen/oeBmvZ/">higher-communication</a> by Swan (<a href="https://codepen.io/jiangjiu8357">@jiangjiu8357</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
