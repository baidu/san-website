---
title: Messaging from Dynamic Child Components
categories:
- practice
---

Child components can be created dynamically using the runtime data. **dispatch/message** won't work cause there's no parent-child relationship between the current component and the newly created one. For a fix, all we need to do is building the relationship.

#### example

Here's a example in which we need to create a tree of components from the tree structure in the data, and pass messages between the parent and children:

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

#### Demo

<p data-height="365" data-theme-id="0" data-slug-hash="QMMZPV" data-default-tab="js,result" data-user="zhanfang" data-embed-version="2" data-pen-title="QMMZPV" class="codepen">See the Pen <a href="https://codepen.io/zhanfang/pen/QMMZPV/">QMMZPV</a> by zhanfang (<a href="https://codepen.io/zhanfang">@zhanfang</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
