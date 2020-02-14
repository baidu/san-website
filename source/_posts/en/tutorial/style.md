---
title: Style
categories:
- tutorial
---

Style processing is a common scenario when writing view templates. The attributes involved are class and style, and they are handled differently from other element attributes. This article specifically describes the common scenarios in style processing.

Before starting, let's emphasize that San does not provide a special binding syntax for class and style processing, and they handle the same way as other attributes.

class
------

We might design some class to represent the state, whether these classes should be added to the element, depending on the value of some data. A simple scenario is the unfolding and unfolding state of a drop-down list.

```html
<!-- template -->
<div>
    <button on-click="toggle"></button>
    <ul class="list{{isHidden ? ' list-hidden' : ''}}">...</ul>
</div>
```

```javascript
// Component
san.defineComponent({
    toggle: function () {
        var isHidden = this.data.get('isHidden');
        this.data.set('isHidden', !isHidden);
    }
});
```

In the above example, `list-hidden` class appears when `isHidden` is `true`, otherwise it is omitted

When designing, San wants the view template developer to write class and style just like a normal attribute, so no special binding syntax is provided. This can be achieved by the ternary operator.

The following example is a scenario where different classes are switched depending on the state.


```html
<ul class="list {{isHidden ? 'list-hidden' : 'list-visible'}}">...</ul>
```

style
-----

The handling of `style` is usually not as complicated as `class`. We rarely write style information in the data, but sometimes we expect users to be able to customize some interface styles, at which point the style may be derived from data.

```html
<ul>
    <li
        s-for="item, index in datasource"
        style="background: {{item.color}}"
        class="{{item.id == value ? 'selected' : ''}}"
        on-click="itemClick(index)"
    >{{ item.title }}</li>
</ul>
```

The caveat is that the data may not exist, and the style you set is not a legal style. If you can't guarantee that the data must have a value, you need to include the style name in the interpolation.

```html
<ul>
    <li
        s-for="item, index in datasource"
        style="{{item.color ? 'background:' + item.color : ''}}"
        class="{{item.id == value ? 'selected' : ''}}"
        on-click="itemClick(index)"
    >{{ item.title }}</li>
</ul>
```
