---
title: 如何实现元素的显示/隐藏？
categories:
- practice
---

通过`s-if`指令，我们可以为元素指定条件。只有当条件成立时元素才会渲染，否则元素不会被加载。

但`s-if`无法实现这样的需求：我们需要在符合条件的情况下显示某元素，条件不满足时，元素在页面中隐藏，但依然被挂载到 DOM 。这个时候，元素的展现用 CSS 控制更为合适。

这一需求的本质可以归纳为：如何根据条件实现元素的显示/隐藏。

### 如何处理

 San 提供在视图模板中进行样式处理的方案，[详见教程](https://baidu.github.io/san/tutorial/style/)。你可以用不同的 class 控制样式，也可以用 inline 样式实现。

#### 1. 用 class 控制元素的显示与隐藏

```html
<!-- template -->
<div>
    <ul class="list{{isHidden ? ' list-hidden' : ' list-visible'}}"></ul>
</div>
```

注意， class 属性有多个类名时，需要为第一个以后的类名加上空格。

 codepen 演示如下：

<p
    data-height="365"
    data-theme-id="0"
    data-slug-hash="ZaOajj"
    data-default-tab="js,result"
    data-user="Mona_"
    data-embed-version="2"
    data-pen-title="根据条件添加不同样式－用class控制"
    class="codepen">See the Pen
    <a href="https://codepen.io/Mona_/pen/ZaOajj/">根据条件添加不同样式－用class控制</a>
     by MinZhou (<a href="https://codepen.io/Mona_">@Mona_</a>) on
     <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

 CSS 控制着样式的展现，所以 DOM 始终都存在页面节点树中。你可以打开控制台看看。

#### 2. 用内联样式控制元素的隐藏与显示

```html
<!-- template -->
<div>
    <ul style="display: {{isHidden ? 'none' : 'block'}}">visible</ul>
</div>
```

<p
    data-height="365"
    data-theme-id="0"
    data-slug-hash="gXMvBN"
    data-default-tab="js,result"
    data-user="Mona_"
    data-embed-version="2"
    data-pen-title="根据条件添加不同样式－用内联样式控制"
    class="codepen">See the Pen
    <a href="https://codepen.io/Mona_/pen/gXMvBN/">根据条件添加不同样式－用内联样式控制</a>
     by MinZhou (<a href="https://codepen.io/Mona_">@Mona_</a>) on
     <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

有时候数据可能并不存在，所以把样式名包含在插值中更为可靠。

```html
<!-- template -->
<div>
    <ul style="{{isHidden === false ? 'display: none' : 'display: block'}}">visible</ul>
</div>
```

#### 3. 使用计算属性

前面的两种方案都可以通过使用计算属性，将判断逻辑从模板中解耦出来，以便更好的应对可能变得更为复杂的需求。下面是基于 class 的例子：

```js
san.defineComponent({
    template: `
        <div>
            <ul class="{{ulClass}}"></ul>
        </div>
    `,
    computed: {
        ulClass() {
            const isHidden = this.data.get('isHidden');
            if (isHidden) {
                return 'list list-hidden';
            }
            return 'list list-visible';
        }
    }
})
```

 codepen 演示如下：

<p data-height="265" data-theme-id="0" data-slug-hash="zPNvwz" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="基于 computed 的元素显示隐藏" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/zPNvwz/">基于 computed 的元素显示隐藏</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### 4. 使用 filter

 filter 也可以用于对 class 和 style 进行处理，解耦的效果和 computed 类似，其特点是能够显式地声明属性值与数据的依赖关系。下面是基于 class 的例子：

```js
san.defineComponent({
    template: `
        <div>
            <ul class="{{isHidden | handleHidden}}"></ul>
        </div>
    `,
    filters: {
        handleHidden(isHidden) {
            if (isHidden) {
                return 'list list-hidden';
            }
            return 'list list-visible';
        }
    }
})
```

 codepen 演示如下：

<p data-height="265" data-theme-id="0" data-slug-hash="ZaLbae" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="基于 filter 的元素显示隐藏" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/ZaLbae/">基于 filter 的元素显示隐藏</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

我们可以很明显地看出，class 是由 isHidden 控制的。

这里要额外注意的是，如果和 class 关联的有多个 data ，用 filter 的方法可能会有一些问题，比如我在下面的例子中实现了一个tab组件：

```js
san.defineComponent({
    template: `
        <div class="tab">
            <div
                s-for="tab in tabs"
                class="{{tab.value | mapActive}}"
                on-click="tabChange(tab.value)"
                >
                {{tab.name}}
            </div>
        </div>
    `,
    initData() {
        return {
            active: '',
            tabs: [
                {
                    name: '第一项',
                    value: 'one'
                },
                {
                    name: '第二项',
                    value: 'two'
                }
            ]
        };
    },
    tabChange(value) {
        this.data.set('active', value);
    },
    filters: {
        mapActive(value) {
            const active = this.data.get('active');
            const classStr = 'sm-tab-item';
            if (value === active) {
                return classStr + ' active';
            }
            return classStr;
        }
    }
});
```

 codepen 演示如下：

<p data-height="265" data-theme-id="0" data-slug-hash="XzpmVa" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="没有显式声明依赖的tab bug演示" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/XzpmVa/">没有显式声明依赖的tab bug演示</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

此处当我在点击 tab 的时候，虽然 active 能够正常更新，但是视图不会引起变化，因为 San 的依赖收集机制不认为 active 的修改会影响到视图，因此需要我们在模板中显式声明对 active 的依赖，参考如下代码：

```js
san.defineComponent({
    // 将下面的 mapActive 改成 mapActive(active)，显示声明视图对 active 的依赖
    template: `
        <div class="tab">
            <div
                s-for="tab in tabs"
                class="{{tab.value | mapActive(active)}}"
                on-click="tabChange(tab.value)"
                >
                {{tab.name}}
            </div>
        </div>
    `,
    initData() {
        return {
            active: '',
            tabs: [
                {
                    name: '第一项',
                    value: 'one'
                },
                {
                    name: '第二项',
                    value: 'two'
                }
            ]
        };
    },
    tabChange(value) {
        this.data.set('active', value);
        this.fire('change', value);
    },
    filters: {
        // 这里就不需要通过 this.data.get('active') 拿到 active 了
        mapActive(value, active) {
            const classStr = 'sm-tab-item';
            if (value === active) {
                return classStr + ' active';
            }
            return classStr;
        }
    }
});
```

 codepen 演示如下：

<p data-height="265" data-theme-id="0" data-slug-hash="mqReLg" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="显式声明依赖的tab演示" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/mqReLg/">显式声明依赖的tab演示</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

通过在模板中显示声明视图对 active 的依赖， San 就能正常更新视图了。这也是为什么我会在一开始说 filter 的特点是能够显式地声明属性值与数据的依赖关系。

### 结语

隐藏和显示是开发中较为常见的需求，还有一些其他的**样式切换**需求，使用以上两种方法都可以轻松实现。

总结一下，如果你要控制元素的渲染与否（是否添加到节点树），你需要使用`s-if`指令；如果你仅仅只想控制 DOM 节点的样式，比如元素的显示/隐藏样式，请使用数据控制 class 或内联样式。
