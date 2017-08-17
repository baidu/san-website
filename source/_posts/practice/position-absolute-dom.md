---
title: 如何处理绝对定位组件的 DOM？
categories:
- practice
---

在我们使用 San 开发的时候，我们常常会写各种的组件，当一个父组件的子组件是绝对定位组件(比如：Select、Tip 等)的时候，我们会遇到两种场景：

- 场景一：父(祖)组件足够大或不存在 `overflow: hidden;`
- 场景二：父(祖)组件不够大且存在 `overflow: hidden;`

而这两种情形下，我们需要对绝对定位组件的 DOM 做一些处理。

那针对这两种场景我们分别可以如何处理呢？

### 如何处理

#### 场景一
父(祖)组件足够大或不存在 `overflow: hidden;` 时的绝对定位。

这种情况比较常规，我们可以直接引入组件，然后可选择在外部或组件内部包含一个 (not static) 元素，来控制显示即可。

##### 使用

```javascript
class AbsComponent extends san.Component {
    static template = `
        <div>
            <p class="absolute">子绝对定位组件</p>
        </div>
    `;
}

class Parent extends san.Component {
    static template = `
        <div>
            <div class="parent-rel">
                <h3>父是static</h3>
                <abs-comp></abs-comp>
            </div>
        </div>
    `;

    static components = {
        'abs-comp': AbsComponent
    };
}

new Parent().attach(document.querySelector('#paIsRel'));
```

##### 示例
<p
    data-height="365"
    data-theme-id="dark"
    data-slug-hash="EvbQQd"
    data-default-tab="js,result"
    data-user="The-only"
    data-embed-version="2"
    data-pen-title="position-absolute-dom"
    class="codepen">See the Pen
        <a href="https://codepen.io/The-only/pen/EvbQQd">position-absolute-dom</a>
        by dengxiaohong (<a href="https://codepen.io/The-only">@The-only</a>)
        on <a href="https://codepen.io">CodePen</a>.
</p>


#### 场景二
父(祖)组件不够大且存在 `overflow: hidden;` 时的绝对定位。

这种情况会很常见，如果直接包含的话绝对定位元素会因为父(祖)组件有`overflow: hidden;`且不够大而导致组件中超出部分被遮住。

若不想被遮住的话，我们可以在组件中做一层处理：

- 将组件元素挂到 body 上
- 需要显示的时候进行位置控制
- 父组件调用

##### 使用
```javascript
class AbsComponent extends san.Component {
    static template = `
        <div class="abs-wrap">
            <div class="abs" style="{{mainStyle}}">
                show content
            </div>
        </div>
    `;

    initData() {
        return {
            targetElem: document.body,
            mainStyle: ''
        };
    }

    attached() {
        // 将绝对定位元素放在body上
        if (this.el.parentNode !== document.body) {
            document.body.appendChild(this.el);
        }

        // 显示的时候进行位置控制
        this.changePosition();
    }

    /**
     * 调整位置信息
     */
    changePosition() {
        // 这里可以替换成封装的组件来进行位置控制
        let targetElem = this.data.get('targetElem');
        targetElem = typeof targetElem === 'function' ? targetElem() : targetElem;

        let rect = targetElem.getBoundingClientRect();
        let left = rect.left;
        let top = document.body.scrollTop + rect.top + rect.height;

        let str = 'left:' + left + 'px;top:' + top + 'px;';
        this.data.set('mainStyle', str);
    }
}

class Parent extends san.Component {
    static template = `
        <div>
            <p class="info">父元素100px overflow:hidden;</p>
            <div class="parent-wrap">
                <span class="btn">click toggle</span>
                <abs-comp targetElem="{{getTarget}}"></abs-comp>
            </div>
        </div>
    `;

    static components = {
        'abs-comp': AbsComponent
    };

    initData() {
        return {
            getTarget: this.getTarget.bind(this)
        };
    }

    /**
     * 获取相对定位的元素
     *
     * @return {HTMLElemnt} 相对定位的元素
     */
    getTarget() {
        return this.el.querySelector('.btn');
    }
}

new Parent().attach(document.querySelector('#instance'));
```
##### 示例
<p
    data-height="365"
    data-theme-id="dark"
    data-slug-hash="VzMjNQ"
    data-default-tab="js,result"
    data-user="The-only"
    data-embed-version="2"
    data-pen-title="position-absolute-dom"
    class="codepen">See the Pen
        <a href="https://codepen.io/The-only/pen/VzMjNQ">position-absolute-dom</a>
        by dengxiaohong (<a href="https://codepen.io/The-only">@The-only</a>)
        on <a href="https://codepen.io">CodePen</a>.
</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
