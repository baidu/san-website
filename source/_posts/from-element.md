---
title: 组件反解
categories:
- tutorial
---


组件初始化时传入 **el**，其将作为组件根元素，并以此反解析出视图结构。

该特性的意图是：有时我们为了首屏时间，期望初始的视图是直接的 HTML，不由组件渲染。但是我们希望组件为我们管理数据、逻辑与视图，后续的用户交互行为与视图变换通过组件管理。

数据和视图是组件重要的组成部分，我们将从这两个方面说明组件反解的功能。


数据
----


以 **el** 初始化组件时，San 只会从 **el** 中解析出视图结构。San 无法从现有 HTML 结构和复杂的表达式中反向得出数据信息。我们需要通过在初始化时传入 **data**，以指定正确的初始数据。


有时我们不传入正确的数据也没有太大问题，但是不一致总会埋下隐患。比如下面这种尴尬的场景：传入的初始数据与视图上呈现的数据并不同，后续设置的数据如果与初始数据相等时，视图不会刷新，视图上的数据还是错的。

```html
<div id="wrap"><span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span></div>
```

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap'),
    
    data: {
        email: 'error@gmail.com',
        name: 'errorrik'
    }
});

myComponent.data.set('email', 'error@gmail.com');
```

`另外特别强调的`：对于列表数据应该在初始化时保证数据与视图的一致，因为列表的添加删除等复杂操作与视图更新上关系密切，如果一开始对应不上，视图更新可能产生难以预测的结果。

```html
<ul id="list">
    <li>name - email</li>
    <li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">errorrik - errorrik@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>
    <li san-for="p,i in persons" prop-title="{{p.name}}" title="otakustay">otakustay - otakustay@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>
    <script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>
</ul>
```

```javascript
new MyComponent({
    el: wrap.firstChild,
    data: {
        'persons': [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]
    }
})
```



视图
----

以 **el** 初始化组件时，San 会尊重 **el** 的现时 HTML 形态，不会执行任何额外影响视觉的渲染动作。

- 不会使用预设的 template 渲染视图
- 不会创建根元素
- 直接到达 compiled、created、attached 生命周期

但是，**el** 可能需要一些额外的标记，来帮助 San 认识视图的结构（插值、绑定、循环、分支、组件等），以便于后续的行为管理与视图刷新。

### 插值文本

插值文本的标记方式是：在文本后添加一个 **type="text/san"** 的 **script** 标签，里面的内容是插值文本的内容。

```html
<span>errorrik - errorrik@gmail.com<script type="text/san">{{name}} - {{email}}</script></span>
```

`提示`：**type="text/san"** 的 **script** 是重要的标记手段，在循环与分支标记中也会用到它。


### 插值属性

插值属性的标记方式是：在 **prop-** 为前缀的属性上声明属性的内容。

```html
<span title="errorrik - errorrik@gmail.com" prop-title="{{name}} - {{email}}"></span>
```

### 绑定

绑定属性的标记方式与插值属性完全一样：在 **prop-** 为前缀的属性上声明属性的内容，双向绑定用 **{= expression =}** 的形式。

```html
<ui-label prop-title="{{name}}" prop-text="{{jokeName}}"></ui-label>
```

### 循环

```html
<ul id="list">
    <li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">
        errorrik - errorrik@gmail.com
        <script type="text/san">{{p.name}} - {{p.email}}</script>
    </li>
    <li san-for="p,i in persons" prop-title="{{p.name}}" title="otakustay">
        otakustay - otakustay@gmail.com
        <script type="text/san">{{p.name}} - {{p.email}}</script>
    </li>
    <script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>
</ul>
```

循环的标记分成两个部分。首先，对于循环的每个元素，需要标记 **san-for**。通常它们在 HTML 输出端也是以循环的形式存在，不会带来重复编写的工作量。

```html
<li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">
    errorrik - errorrik@gmail.com
    <script type="text/san">{{p.name}} - {{p.email}}</script>
</li>
```

在循环的结束以一个桩元素标记，桩元素是一个具有 **type="text/san"** 和 **san-stump="for"** 的 script。在 script 的内部声明循环的语句。


```html
<script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>
```

`提示`：当初始没有数据时，标记一个循环只需要声明桩即可。


### 分支

分支的标记比较简单，以 **san-if** 标记分支元素即可。

```html
<span san-if="condition" title="errorrik" prop-title="{{name}}"></span>
```

当初始条件为假时，分支元素不会出现，此时以 **type="text/san"** 和 **san-stump="if"** 的 script 作为桩，标记分支。在 script 的内部声明分支的语句。

```html
<script type="text/san" san-stump="if"><span san-if="cond" title="{{name}}">{{name}}</span></script>
```

一个包含完整 if-else 的分支，总有一个元素是具体元素，有一个元素是桩。

```html
<script type="text/san" san-stump="if"><span san-if="isErik" title="{{name}}">{{name}}</span></script>
<span san-else title="otakustay" prop-title="{{name2}}">otakustay<script type="text/san">{{name2}}</script></span>
```

```html
<span san-if="isErik" title="errorrik" prop-title="{{name}}">errorrik<script type="text/san">{{name}}</script></span>
<script type="text/san" san-stump="else"><span san-else title="{{name2}}">{{name2}}</span></script>
```


### 组件

```javascript
san.defineComponent({
    components: {
        'ui-label': Label
    }
});
```

组件的标记与视图模板中声明是一样的，在相应的自定义元素上标记绑定。San 将根据自定义元素的标签自动识别组件。

```html
<ui-label prop-title="{{name}}" prop-text="{{email}}">
    <b prop-title="{{title}}" title="errorrik">errorrik@gmail.com<script type="text/san">{{text}}</script></b>
</ui-label>
```

我们可能因为样式、兼容性等原因不想使用自定义元素。当组件未使用自定义元素时，可以在元素上通过 **san-component** 标记组件类型。

```html
<label san-component="ui-label" prop-title="{{name}}" prop-text="{{email}}">
    <b prop-title="{{title}}" title="errorrik">errorrik@gmail.com<script type="text/san">{{text}}</script></b>
</label>
```

