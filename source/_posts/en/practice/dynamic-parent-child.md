---
title: 动态子组件如何传递消息给父组件?
categories:
- practice
---

组件的创建中，可能需要在运行时，通过状态树渲染出一个动态组件树。通常的方法，我们通过 **dispatch/message** 但是由于父组件及子组件都是单独动态创建的，因此父子组件之间实际上是没有父子关系的，因此需要将子组件的parentComponent指向父组件，以实现动态父子组件之间的消息传递。

#### example

此处给一个简单的例子，我们需要根据一个简单的状态树实现一个相应的组件样式，并实现父子组件的通信：

```javascript
const Child = san.defineComponent({
    template: `
        <div class="child">
            {{name}}<button on-click="sendMsg">send msg</button>
        </div>
    `,
    sendMsg() {
        this.dispatch('child-msg', this.data.get('msg'));
    }
});

const Parent = san.defineComponent({
    template: `
        <div class="parent" style="border: 1px solid red">
            I am parent
            <button on-click="addChild">
                add child
            </button>
            {{childMsg}}
        </div>`,

    addChild() {

        const childs = this.data.get('childs');
        const parentEl = this.el;

        childs.forEach(child => {

            let childIns = new Child({
                parent: this,
                data: child
            });

            childIns.attach(parentEl);
            this.children.push(childIns);

        });
    },

    messages: {
        'child-msg': function(arg) {
            this.data.set('childMsg', arg.value);
        }
    }
});

const parent = new Parent({
    data: {
        childs: [{
            name: 'I am child1',
            msg: 'child1 send msg'
        }, {
            name: 'I am child2',
            msg: 'child2 send msg'
        }]
    }
});

parent.attach(document.body);
```

#### 实例

<p data-height="365" data-theme-id="0" data-slug-hash="QMMZPV" data-default-tab="js,result" data-user="zhanfang" data-embed-version="2" data-pen-title="QMMZPV" class="codepen">See the Pen <a href="https://codepen.io/zhanfang/pen/QMMZPV/">QMMZPV</a> by zhanfang (<a href="https://codepen.io/zhanfang">@zhanfang</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
