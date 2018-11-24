---
title: How to Implement Hide and Show?
categories:
- practice
---

With the `s-if` directive, we can conditionally render a element.

But that's not sufficient if we want to hide rather than remove the element when conditions not satisfied, in which case the element is still attached to the DOM tree and therefore CSS is more eligible.

We'll discuss how to implement Hide and Show in the rest of this article.

In San, `class` and `style` attributes can be used to applying CSS styles. See [this article](https://baidu.github.io/san/tutorial/style/) for details.

#### 1. Applying Specific `class` Names


```html
<!-- template -->
<div>
    <ul class="list{{isHidden ? ' list-hidden' : ' list-visible'}}"></ul>
</div>
```

Note: An extra space should be present before every subsequent class name.

A demo from codepen:

<p
    data-height="365"
    data-theme-id="0"
    data-slug-hash="ZaOajj"
    data-default-tab="js,result"
    data-user="Mona_"
    data-embed-version="2"
    data-pen-title="Conditionally Applying Styles - Via the Class Attribute"
    class="codepen">See the Pen
    <a href="https://codepen.io/Mona_/pen/ZaOajj/">Conditionally Applying Styles - Via the Class Attribute</a>
     by MinZhou (<a href="https://codepen.io/Mona_">@Mona_</a>) on
     <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

With visibility controled by CSS, the element is always attached to the DOM tree. Open your console to check it out.

#### 2. Via the `style` Attribute

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
    data-pen-title="Conditionally Applying Styles - Via the Style Attribute"
    class="codepen">See the Pen
    <a href="https://codepen.io/Mona_/pen/gXMvBN/">Conditionally Applying Styles - Via the Style Attribute</a>
     by MinZhou (<a href="https://codepen.io/Mona_">@Mona_</a>) on
     <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

In case `isHidden` is absent, it's more robust to toggle the value along with the property name.

```html
<!-- template -->
<div>
    <ul style="{{isHidden === false ? 'display: none' : 'display: block'}}">visible</ul>
</div>
```

#### 3. Computed Attributes

In both of the above examples, the attribute value can be dynamically computed so that the Hide and Show logic can be extracted out of the template to better cope with complex situations. In the following example, we use a computed class name:

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

Demo from codepen:

<p data-height="265" data-theme-id="0" data-slug-hash="zPNvwz" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="Hide and Show Via a Computed Attribute" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/zPNvwz/">Hide and Show Via a Computed Attribute</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### 4. Applying a Filter

*filters* can also be applied to transform the class and style attributes. As with the computed attributes, the Hide and Show logic is extracted out of the template, but into the filters this time. The difference is that the input dependency is declared explicitly. In the following example, we apply a filter to the class attribute:

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

Demo from codepen:

<p data-height="265" data-theme-id="0" data-slug-hash="ZaLbae" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="Hide and Show - Applying a Filter" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/ZaLbae/">Hide and Show - Applying a Filter</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

It's obvious that the class is determined by `isHidden`.

Issues can arise when the filter depends on additional data, take the Tab component for example:

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
                    name: 'First Item',
                    value: 'one'
                },
                {
                    name: 'Second Item',
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

Demo from codepen:

<p data-height="265" data-theme-id="0" data-slug-hash="XzpmVa" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="Tab Bug from Not Declared Dependency" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/XzpmVa/">Tab Bug from Not Declared Dependency</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

When the tab is clicked, the class won't update despite that the `active` is changed. That happens due to the San dependency collection mechanism not recognizing the `active` as one of the dependencies of the view. The fix is simple: we declare the dependency explicitly.

```js
san.defineComponent({
    // change `mapActive` to `mapActive(active)`, declare the dependency to `active`
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
                    name: 'First Item',
                    value: 'one'
                },
                {
                    name: 'Second Item',
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
        // Now `active` is passed in
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

Demo from codepen:

<p data-height="265" data-theme-id="0" data-slug-hash="mqReLg" data-default-tab="js,result" data-user="LeuisKen" data-embed-version="2" data-pen-title="Tab Demo with Dependency Declared" class="codepen">See the Pen <a href="https://codepen.io/LeuisKen/pen/mqReLg/">Tab Demo with Dependency Declared</a> by LeuisKen (<a href="https://codepen.io/LeuisKen">@LeuisKen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Now the view will be updated properly. Again we see that the usage of filters makes input dependencies explicit.

### Conclusion

Besides Hide and Show, there're plenty of other cases related to **style switching**, which can be implemented in the same way.

In conclusion, if you need a conditional rendering, use the `s-if` directive; if you only need to switch styles, such as Hide and Show, use `class` and `style` attributes.
