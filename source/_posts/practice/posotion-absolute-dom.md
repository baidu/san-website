---
title: 如何处理绝对定位组件的 DOM？
categories:
- practice
---

在San中 各模块都是由component组合而成，当某个component是绝对定位的直接的时候，我们需要考虑决定定位元素是相对于谁[offsetParent(not static)];

这时候存在两种场景：

- 场景一：父(祖)组件足够大或不存在`overflow: hidden;`
- 场景二：父(祖)组件不够大且存在`overflow: hidden;`

针对这两种场景我们该如何处理呢？


#### 如何处理

##### 场景一
父(祖)组件足够大或不存在`overflow: hidden;`时的绝对定位

这种情况比较常规，我们可以直接引入组件，然后自由选择在外部或组件内部包含一个非`position: static`元素，来控制显示即可
这个我们可以直接看最底部的示例效果，这里暂不做过多介绍


##### 场景二
父(祖)组件不够大且存在`overflow: hidden;`时的绝对定位

这种情况比较常见，如果直接包含的话绝对定位元素会因为父(祖)组件有`overflow: hidden;`且不够大而导致组件中超出部分会遮住，比如：dialog、select、tip等组件；
这时候想要不被遮住的话，我们可以需要在组件中做一层处理：将组件挂在body上并进行位置控制


- 将组件元素挂到body上
- 需要显示的时候进行位置控制
- 父组件调用

```javascript
class Tip extends san.Component {
    static template = `
        <div class="tip-wrap">
            <div s-if="show" class="tip" style="{{mainStyle}}">
                {{content}}
            </div>
        </div>
    `;

    initData() {
        return {
            show: false,
            content: 'show content',
            targetElem: document.body,
            mainStyle: ''
        };
    }

    attached() {
        // 将绝对定位元素挂到body上
        if (this.el.parentNode !== document.body) {
            document.body.appendChild(this.el);
        }

        this.toggleShow(this.data.get('show'));
        this.watch('show', (val) => {
            this.toggleShow(val);
        });
    }

    toggleShow(bool) {
        if (bool) {
            // 需要显示的时候进行位置控制
            this.getPosition();
        }
    }

    getPosition() {
        let targetElem = this.data.get('targetElem');
        targetElem = typeof targetElem === 'function' ? targetElem() : targetElem;
        let rect = targetElem.getBoundingClientRect();
        console.log(rect);
        let str = 'left:' + rect.left + 'px;top:' + (document.body.scrollTop + rect.top + rect.height) + 'px;';
        this.data.set('mainStyle', str);
    }
}

class Instance extends san.Component {
    static template = `
        <div>
            <p class="info">父元素100px overflow:hidden;</p>
            <div class="ins-wrap">
                <span class="btn" on-click="toggleShow">{{name}}</span>
                <simple-tip show="{{show}}" targetElem="{{getTarget}}"></simple-tip>
            </div>
        </div>
    `;

    // 引入使用
    static components = {
        'simple-tip': Tip
    };

    initData() {
        return {
            name: 'click toggle',
            show: false,
            getTarget: this.getTarget.bind(this)
        };
    }

    toggleShow() {
        this.data.set('show', !this.data.get('show'));
    }

    getTarget() {
        return this.el.querySelector('.btn');
    }
}

let InstanceApp = new Instance();
InstanceApp.attach(document.getElementById('instance'));
```

#### 示例
##### 场景一
<p
    data-height="265"
    data-theme-id="dark"
    data-slug-hash="EvbQQd"
    data-default-tab="js,result"
    data-user="The-only"
    data-embed-version="2"
    data-pen-title="san-traverse-object"
    class="codepen">See the Pen
        <a href="https://codepen.io/The-only/pen/EvbQQd">san-traverse-object</a>
        by dengxiaohong (<a href="https://codepen.io/The-only">@The-only</a>)
        on <a href="https://codepen.io">CodePen</a>.
</p>

##### 场景二
<p
    data-height="265"
    data-theme-id="dark"
    data-slug-hash="VzMjNQ"
    data-default-tab="js,result"
    data-user="The-only"
    data-embed-version="2"
    data-pen-title="san-traverse-object"
    class="codepen">See the Pen
        <a href="https://codepen.io/The-only/pen/VzMjNQ">san-traverse-object</a>
        by dengxiaohong (<a href="https://codepen.io/The-only">@The-only</a>)
        on <a href="https://codepen.io">CodePen</a>.
</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
