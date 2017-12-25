---
title: 组件反解
categories:
- tutorial
---


组件初始化时传入 **el**，其将作为组件根元素，并以此反解析出视图结构。

该特性的意图是：有时我们为了首屏时间，期望初始的视图是直接的 HTML，不由组件渲染。但是我们希望组件为我们管理数据、逻辑与视图，后续的用户交互行为与视图变换通过组件管理。

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap').firstChild
});
```

以 **el** 初始化组件时，San 会尊重 **el** 的现时 HTML 形态，不会执行任何额外影响视觉的渲染动作。

- 不会使用预设的 template 渲染视图
- 不会创建根元素
- 直接到达 compiled、created、attached 生命周期

但是，**el** 可能需要一些额外的标记，来帮助 San 认识数据与视图的结构（插值、绑定、循环、分支、组件等），以便于后续的行为管理与视图刷新。

数据和视图是组件重要的组成部分，我们将从这两个方面说明组件反解的功能。

`提示`：如果使用 NodeJS 做服务端，San 提供了 [服务端渲染](../ssr/) 的支持，能够天然输出标记好可被组件反解的 HTML，你无需了解组件反解的标记形式。如果你服务端使用其他的语言（比如PHP），请继续往下阅读。


视图
----

该章节介绍如何对视图的结构（插值、绑定、循环、分支、组件等）进行标记。

### 插值文本

插值文本的标记方式是：在文本的前后各添加一个注释。

- 文本前的注释以 **s-text:** 开头，紧跟着插值文本的声明。
- 文本后的注释内容为 **/s-text**，代表插值文本片段结束。

```html
<span><!--s-text:{{name}} - {{email}}-->errorrik - errorrik@gmail.com<!--/s-text--></span>
```

`提示`：**s- 开头的 HTML Comment** 是重要的标记手段，在循环与分支标记中也会用到它。


### 插值属性

插值属性的标记方式是：在 **prop-** 为前缀的属性上声明属性的内容。

```html
<span title="errorrik - errorrik@gmail.com" prop-title="{{name}} - {{email}}"></span>
```

### 绑定

绑定属性的标记方式与插值属性完全一样：在 **prop-** 为前缀的属性上声明属性的内容。

```html
<ui-label prop-title="{{name}}" prop-text="{{jokeName}}"></ui-label>
```

双向绑定用 **{= expression =}** 的形式。

```html
<input prop-value="{=name=}" value="errorrik">
```


### 循环

对于循环，我们需要以桩元素，分别标记循环的 **起始** 和 **结束**。

```html
<ul id="list">
    <!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
    <li prop-title="{{p.name}}" title="errorrik"><!--s-text:{{p.name}} - {{p.email}}-->errorrik - errorrik@gmail.com<!--/s-text--></li>
    <li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
    <!--/s-for-->
</ul>
```

**起始** 的桩元素标记是一个以 **s-for:** 开头的 HTML Comment，接着是声明循环的标签内容。

```html
<!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
```

**结束** 的桩元素标记是一个内容为 **/s-for** 的 HTML Comment。

```html
<!--/s-for-->
```

对于循环的每个元素，按照普通元素标记，无需标记 **for** directive。通常它们在 HTML 输出端也是以循环的形式存在，不会带来重复编写的工作量。

```html
<li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
```

`提示`：当初始没有数据时，标记循环只需要声明 **起始** 和 **结束** 桩即可。


### 分支

分支的标记比较简单，以 **s-if** 标记分支元素即可。

```html
<span s-if="condition" title="errorrik" prop-title="{{name}}"></span>
```

当初始条件为假时，分支元素不会出现，此时以 **HTML Comment** 为桩，标记分支。在桩的内部声明分支的语句。

```html
<!--s-if:<span s-if="cond" title="{{name}}">{{name}}</span>--><!--/s-if-->
```

一个包含完整 if-else 的分支，总有一个元素是具体元素，有一个元素是桩。

```html
<!--s-if:<span s-if="isErik" title="{{name}}">{{name}}</span>--><!--/s-if-->
<span s-else title="otakustay" prop-title="{{name2}}"><!--s-text:{{name2}}-->otakustay<!--/s-text--></span>
```

```html
<span s-if="isErik" title="errorrik" prop-title="{{name}}"><!--s-text:{{name}}-->errorrik<!--/s-text--></span>
<!--s-else:<span s-else title="{{name2}}">{{name2}}</span>--><!--/s-else-->
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
    <b prop-title="{{title}}" title="errorrik"><!--s-text:{{text}}-->errorrik@gmail.com<!--/s-text--></b>
</ui-label>
```

我们可能因为样式、兼容性等原因不想使用自定义元素。当组件未使用自定义元素时，可以在元素上通过 **s-component** 标记组件类型。

```html
<label s-component="ui-label" prop-title="{{name}}" prop-text="{{email}}">
    <b prop-title="{{title}}" title="errorrik"><!--s-text:{{text}}-->errorrik@gmail.com<!--/s-text--></b>
</label>
```

### slot

slot 的标记与循环类似，我们需要以桩元素，分别标记循环的 **起始** 和 **结束**。

```html
<div id="main">
    <!--s-data:{"tabText":"tab","text":"one","title":"1"}-->
    <div s-component="ui-tab" prop-text="{{tabText}}">
        <div prop-class="head" class="head">
            <!--s-slot:title-->
            <h3 prop-title="{{title}}" title="1"><!--s-text:{{title}}-->1<!--/s-text--></h3>
            <!--/s-slot-->
        </div>
        <div>
            <!--s-slot-->
            <p prop-title="{{text}}" title="one"><!--s-text:{{text}}-->one<!--/s-text--></p>
            <!--/s-slot-->
        </div>
    </div>
</div>
```

```javascript
var Tab = san.defineComponent({
    template: [
        '<div>',
        '    <div class="head"><slot name="title"></slot></div>',
        '    <div><slot></slot></div>',
        '</div>'
    ].join('\n')
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: [
        '<div><ui-tab text="{{tabText}}">',
        '    <h3 slot="title" title="{{title}}">{{title}}</h3>',
        '    <p title="{{text}}">{{text}}</p>',
        '</ui-tab></div>'
    ].join('\n')
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```


**起始** 的桩元素标记是一个以 **s-slot:** 开头的 HTML Comment，接着是 slot 名称。

```html
<!--s-slot:title-->
```

**结束** 的桩元素标记是一个内容为 **/s-slot** 的 HTML Comment。

```html
<!--/s-slot-->
```

当 owner 未给予相应内容时，slot 的内容为组件内声明的默认内容，这时 slot 内环境为组件内环境，而不是组件外环境。对默认内容，需要在 **起始** 的桩元素 name 之前加上 **!** 声明。

```html
<!--s-slot:!title-->
```



数据
----

组件的视图是数据的呈现。我们需要通过在组件起始时标记 **data**，以指定正确的初始数据。初始数据标记是一个 **s-data:** 开头的 HTML Comment，在其中声明数据。

```html
<div id="wrap">
    <!--s-data:{
        email: 'error@gmail.com',
        name: 'errorrik'
    }-->
    <span title="errorrik@gmail.com" prop-title="{{email}}"><!--s-text:{{name}}-->errorrik<!--/s-text--></span>
</div>
```

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('wrap')
});
```

`警告`：如果 HTML 中只包含视图结果，不包含数据，组件无法从视图的 DOM 结构中解析出其代表数据，在后续的操作中可能会导致不期望的后果。

比如，对于列表数据应该在初始化时保证数据与视图的一致，因为列表的添加删除等复杂操作与视图更新上关系密切，如果一开始对应不上，视图更新可能产生难以预测的结果。

```html
<ul id="list">
    <li>name - email</li>
    <!--s-for:<li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>-->
    <li prop-title="{{p.name}}" title="errorrik"><!--s-text:{{p.name}} - {{p.email}}-->errorrik - errorrik@gmail.com<!--/s-text--></li>
    <li prop-title="{{p.name}}" title="otakustay"><!--s-text:{{p.name}} - {{p.email}}-->otakustay - otakustay@gmail.com<!--/s-text--></li>
    <!--/s-for-->
</ul>
```

```javascript
var myComponent = new MyComponent({
    el: document.getElementById('list')
});

// 组件不包含初始数据标记
// 下面的语句将导致错误
myComponent.data.removeAt('persons', 1);
```

`提示`：如果一个组件拥有 owner，可以不用标记初始数据。其初始数据由 owner 根据绑定关系灌入。

```html
<!-- ui-label 组件拥有 owner，无需进行初始数据标记 -->
<div id="main">
    <!--s-data:{"name":"errorrik"}-->
    <span s-component="ui-label" prop-text="{{name}}"><!--s-text:{{text}}-->errorrik<!--/s-text--></span>
</div>
```

```javascript
var Label = san.defineComponent({
    template: '<span>{{text}}</span>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label text="{{name}}"></ui-label></div>'
});

var myComponent = new MyComponent({
    el: document.getElementById('main')
});
```

