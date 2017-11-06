---
title: 根据条件添加不同的样式
categories:
- practice
---

通过`s-if`指令，我们可以为元素指定条件。只有当条件成立时元素才会渲染，否则元素不会被加载。

但`s-if`无法实现这样的需求：我们需要在符合条件的情况下渲染某元素，条件不满足时，该元素依然需要被渲染并挂载到DOM中，只是在页面中不可见。这个时候，元素的展现用CSS控制更为合适。

这类需求的本质可以归纳为：如何根据条件为同一元素添加不同的样式。

### 如何处理

San提供在视图模板中进行样式处理的方案，[详见教程](http://localhost:4000/san/tutorial/style/)。你可以用不同的class控制样式，也可以用inline样式实现。

#### 1. 用class控制元素的显示与隐藏

````javascript
<!-- template -->
<div>
    <ul class="list{{isHidden ? ' list-hidden' : ' list-visible'}}"></ul>
</div>

````

注意，class属性有多个类名时，需要为第一个以后的类名加上空格。

codepen演示如下：

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


CSS控制着样式的展现，所以DOM始终都存在页面节点树中。你可以打开控制台看看。

#### 2. 用内联样式控制元素的隐藏与显示

````javascript
<!-- template -->
<div>
    <ul style="display: {{isHidden ? 'none' : 'block'}}">visible</ul>
</div>

````

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

````javascript
<!-- template -->
<div>
    <ul style="{{isHidden === false ? 'display: none' : 'display: block'}}">visible</ul>
</div>

````

隐藏和显示是开发中较为常见的需求，还有一些其他的样式切换需求，San同样也可以实现。

总结一下，如果你要控制元素的渲染与否（是否添加到节点树），你需要使用`s-if`指令；如果你仅仅只想控制DOM节点的样式，请使用数据控制class或内联样式。