---
title: 模板
categories:
- tutorial
---

San使用基于HTML的模板，允许你以声明的方式将渲染的DOM和San实例的数据绑定。


场景
-----

### 插值

和许多模板引擎一样，插值的语法形式是表达式位于双大括号中，表达式后可以接任意多个过滤器。

```
{{ expr [[| filter-call1] | filter-call2...] }}
```


在文本内容区域我们可以使用插值替换。

```html
<p>Hello {{name}}!</p>
```

在 HTML 标签的 属性(attribute) 内，我们也可以使用插值替换。

```html
<span title="This is {{name}}">{{name}}</span>
```

使用过滤器可以对插值数据进行处理。

```html
<p>Hello {{name | upper}}!</p>
```

`表达式`：在插值替换的双大括号中，San 提供了丰富的表达式支持，具体请参考本篇后续的[表达式](#表达式)章节。

`过滤器`：过滤器相关描述请参考本篇后续的[过滤器](#过滤器)章节。


`提示`：插值将默认进行 HTML 转义。如果不需要 HTML 转义请参考本篇后续的[输出HTML](#输出HTML)章节。


### 属性绑定


顾名思义，属性绑定的意思是，将数据绑定到子组件的 属性(property) 上。属性绑定的形式和插值绑定相同，\\通过 HTML 标签的 属性(attribute)声明，通常情况只声明一个 **{{ expression }}**。

下面的例子中，当 jokeName 数据变化时，会自动将新的值设置到 label 组件的 text 属性中。

```html
<ui-label text="{{jokeName}}"></ui-label>
```


`表达式`：属性绑定支持任意类型的表达式，具体请参考本篇后续的[表达式](#表达式)章节。


### 属性整体绑定

`版本`：>= 3.5.8

通过 **s-bind** ，可以为组件绑定整个数据。当**s-bind** 和单个的属性绑定并存时，单个的属性绑定将覆盖整体绑定中相应的数据项。

```html
<ui-label s-bind="{{ {text: email, title: name} }}"></ui-label>

<!-- text 单个属性声明将覆盖 s-bind 中的 text 项 -->
<ui-label s-bind="{{ {text: email, title: name} }}" text="{{name}}"></ui-label>
```


`提示`：对象字面量常用于属性整体绑定。


### 双向绑定


通过 HTML 标签的 属性(attribute)声明 **{= expression =}**，可以进行双向绑定。

双向绑定通常出现在 **用户输入** 的场景，将用户输入结果自动更新到组件数据。所以我们通常在 **输入表单元素** 或 **具有输入反馈的自定义组件** 上应用双向绑定。

下面的例子将 input、select、自定义组件的 value 属性与声明的数据项（name、online、color）建立了双向绑定关系。当用户输入时，相应数据项的值会发生变化。

```html
<input type="text" value="{= name =}">

<select value="{= online =}">
    <option value="errorrik">errorrik</option>
    <option value="otakustay">otakustay</option>
    <option value="firede">firede</option>
</select>

<ui-colorpicker value="{= color =}"></ui-colorpicker>
```

`表达式`：双向绑定仅支持普通变量和属性访问表达式，否则可能导致不可预测的问题。


原始HTML
------

有时候我们希望输出不被转义的真实HTML，在 San 里有两种方式可以做到。

1. 指令 `s-html`
2. 过滤器 raw。过滤器 raw 是一个虚拟过滤器

```html
<p s-html="rawHTML"></p>
<p>{{rawHTML | raw}}</p>
```


表达式
------

San 提供了丰富的表达式类型支持，让使用者在编写视图模板时更方便。

- 数据访问(普通变量、属性访问)
- 一元否定
- 一元取负 `>= 3.6.6`
- 二元运算
- 二元关系
- 三元条件
- 括号
- 字符串
- 数值
- 布尔
- 数组字面量 `>= 3.5.9`
- 对象字面量 `>= 3.5.9`
- 方法调用 `>= 3.6.11`


下面通过插值替换的例子列举支持的表达式类型。

```html
<!-- 普通变量 -->
<p>{{name}}</p>

<!-- 属性访问 -->
<p>{{person.name}}</p>
<p>{{persons[1]}}</p>

<!-- 一元否定 -->
<p>{{!isOK}}</p>
<p>{{!!isOK}}</p>

<!-- 一元取负 -->
<p>{{-num1 + num2}}</p>

<!-- 二元运算 -->
<p>{{num1 + num2}}</p>
<p>{{num1 - num2}}</p>
<p>{{num1 * num2}}</p>
<p>{{num1 / num2}}</p>
<p>{{num1 + num2 * num3}}</p>

<!-- 二元关系 -->
<p>{{num1 > num2}}</p>
<p>{{num1 !== num2}}</p>

<!-- 三元条件 -->
<p>{{num1 > num2 ? num1 : num2}}</p>

<!-- 括号 -->
<p>{{a * (b + c)}}</p>

<!-- 数值 -->
<p>{{num1 + 200}}</p>

<!-- 字符串 + 三元条件 -->
<p>{{item ? ',' + item : ''}}</p>

<!-- 数组字面量 -->
<x-list data="{{ persons || [] }}" />

<!-- 对象字面量 -->
<x-article data="{{ {title: articleTitle, author: user} }}" />

<!-- 方法调用 -->
<p>{{max(num1, num2)}}</p>
```

`注意`：双向绑定仅支持普通变量和属性访问表达式。


数据的视图变换
------

我们经常遇到 **视图对数据的展示不是原始值** 的场景，比如日期的格式、上次修改时间根据当前时间显示分钟或天等等。在这种场景下，我们可以使用如下方法进行数据的处理和变换：

- 过滤器
- 方法调用


### 过滤器


在插值替换时，过滤器可以实现对插值数据的处理和变换，使其转换成更适合视图呈现的数据形式。`注意`：过滤器仅在插值替换时支持。

插值替换支持多过滤器处理。过滤器之间以类似管道的方式，前一个过滤器的输出做为后一个过滤器的输入，向后传递。

```html
<!-- 普通变量 -->
<p>{{myVariable | html | url}}</p>
```

filter支持参数传递，参数可以是任何支持的[表达式](#表达式)。

```html
<!-- // 假设存在过滤器: comma -->
<p>{{myVariable | comma(3)}}</p>
<p>{{myVariable | comma(commaLength)}}</p>
<p>{{myVariable | comma(commaLength + 1)}}</p>
```

过滤器在组件声明时注册，具体请参考[组件文档过滤器章节](../component/#过滤器)。


### 方法调用

`>= 3.6.11`

在模板中可以直接调用组件中声明的方法。

```javascript
var MyApp = san.defineComponent({
    template: '<u>{{sum(num1, num2)}}</u>',

    sum: function (a, b) {
        return a + b;
    },

    initData: function () {
        return {
            num1: 1,
            num2: 2
        };
    }
});
```

- `优点`：相比 [过滤器](#过滤器)，方法调用有时会显得更直观一些。比如 sum 的场景，通过 [过滤器](#过滤器) 实现就会显得有些别扭。
- `缺点`：[过滤器](#过滤器) 让数据针对视图的处理和变换方法都放在 filters 中，组件上的方法可以专注于视图无关的逻辑行为。如果使用方法调用则破坏了这一点。

```javascript
// 通过 filter 实现 sum 显得有些别扭
var MyApp = san.defineComponent({
    template: '<u>{{num1 | sum(num2)}}</u>',

    filters: {
        sum: function (a, b) {
            return a + b;
        }
    },

    initData: function () {
        return {
            num1: 1,
            num2: 2
        };
    }
});
```

方法调用可以动态选择方法，不过第一级必须是静态的。

```javascript
var MyApp = san.defineComponent({
    template: '<u>{{ops[opType ? 'sum' : 'average'](num1, num2)}}</u>',

    ops: {
        sum: function (a, b) {
            return a + b;
        },

        average: function (a, b) {
            return (a + b) / 2;
        }
    },

    initData: function () {
        return {
            opType: 1,
            num1: 1,
            num2: 2
        };
    }
});
```

调用的方法中，可以通过 this 继续调用组件上的其他方法。

```javascript
var MyApp = san.defineComponent({
    template: '<u>{{enhance(num)}}</u>',

    enhance: function (a) {
        return this.square(a);
    },

    square: function (a) {
        return a * a;
    },

    initData: function () {
        return {
            num: 2
        };
    }
});
```

`警告`：使用方法调用，方法在运行时通过 this.data 可以触及组件的所有数据。但是，千万不要这么干，否则就会造成对数据的隐式依赖，导致数据变化时，视图不会随着更新。下面是错误和正确的示例。

```javascript
var Bad = san.defineComponent({
    template: '<u>{{enhance(num)}}</u>',

    enhance: function (num) {
        return num * this.data.get('times');
    },

    initData: function () {
        return {
            num: 2,
            times: 3
        };
    }
});

var Good = san.defineComponent({
    template: '<u>{{enhance(num, times)}}</u>',

    enhance: function (num, times) {
        return num * times;
    },

    initData: function () {
        return {
            num: 2,
            times: 3
        };
    }
});
```

`提示`：如果使用方法调用，调用的方法最好是无副作用的 pure function。


HTML实体
------

在我们编写 HTML 时，如果内容中包含 HTML 预留字符或特殊字符，我们需要写字符实体。San 的模板 HTML 是自解析的，由于体积的关系，只支持有限的具名字符实体：

- &amp;lt;
- &amp;gt;
- &amp;nbsp;
- &amp;quot;
- &amp;emsp;
- &amp;ensp;
- &amp;thinsp;
- &amp;copy;
- &amp;reg;
- &amp;zwnj;
- &amp;zwj;
- &amp;amp;

```html
<p>LiLei &amp; HanMeiMei are a couple.</p>
<p>1 + 1 &lt; 3</p>
```

除此之外，我们可以使用 `&#[entity_number];` 或 `&#x[entity_number];` 形式的编号字符实体。

```html
<p>LiLei &#38; HanMeiMei are a couple.</p>
<p>1 + 1 &#60; 3</p>
```

