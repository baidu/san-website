---
title: How to deal with the absolute positioning component's DOM？
categories:
- practice
---

When we use San to develop, we often write various components. When a subcomponent of a parent component is an absolutely positioned component (eg: Select, Tip, etc.), we encounter two scenarios:

- scene A: The parent (grandfather) component is large enough or does not exist `overflow: hidden;`
- scene B: The parent (grandfather) component is not large enough and exists `overflow: hidden;`

In both cases, we need to do some processing on the DOM of the absolutely positioned component.

How can we deal with these two scenarios separately?

### How to deal

#### scene A
The parent (grandfather) component is large enough or does not exist `overflow: hidden;`

This situation is more conventional, we can directly import the component, and then choose to include a (not static) element inside or outside the component to control the display.

##### usage

```javascript
class AbsComponent extends san.Component {
    static template = `
        <div>
            <p class="absolute">absolute positioning subcomponent</p>
        </div>
    `;
}

class Parent extends san.Component {
    static template = `
        <div>
            <div class="parent-rel">
                <h3>static parent component</h3>
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

##### example
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


#### sense B
The parent (grandfather) component is not large enough and exists `overflow: hidden;`

This situation is also very common, and if it is imported directly, the absolute positioning element will be obscured by the parent (ancestor) component for it has an 'overflow: hidden;` and is not large enough.

If you don't want it to be obscured, we can add one layer in the component to process:

- append element to `body`
- do position control when display is required
- call by parent component

##### usage
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
        // append absolute position element to body
        if (this.el.parentNode !== document.body) {
            document.body.appendChild(this.el);
        }

        // do position control when display is required
        this.changePosition();
    }

    /**
     * change position
     */
    changePosition() {
        // Here you can replace it with a packaged component for position control
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
            <p class="info">parent component 100px overflow:hidden;</p>
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
     * get relative positioned elements
     *
     * @return {HTMLElemnt} relatively positioned element
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
