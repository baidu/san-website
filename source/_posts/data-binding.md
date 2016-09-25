---
title: 数据绑定
categories:
- tutorial
---

在模板 HTML 中，我们通过一定的数据绑定语法编写，相应的数据就能在视图上呈现。


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



### 属性绑定


顾名思义，属性绑定的意思是，将数据绑定到子组件的 属性(property) 上。属性绑定的形式和插值绑定相同，通过 HTML 标签的 属性(attribute)声明，通常情况只声明一个 **{{ ... }}**。

下面的例子中，当 jokeName 数据变化时，会自动将新的值设置到 label 组件的 text 属性中。

```html
<ui-label text="{{jokeName}}"></ui-label>
```


`表达式`：属性绑定支持任意类型的表达式，具体请参考本篇后续的[表达式](#表达式)章节。




### 双向绑定


通过  HTML 标签的 属性(attribute)声明 **{= ... =}** 的形式，可以声明双向绑定。

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




表达式
------

San 提供了丰富的表达式类型支持，让使用者在编写视图模板时更方便。下面通过插值替换的例子列举支持的表达式类型。

```html
<!-- 普通变量 -->
<p>{{name}}</p>

<!-- 属性访问 -->
<p>{{person.name}}</p>
<p>{{persons[1]}}</p>

<!-- 一元否定 -->
<p>{{!isOK}}</p>
<p>{{!!isOK}}</p>

<!-- 二元运算 -->
<p>{{num1 + num2}}</p>
<p>{{num1 - num2}}</p>
<p>{{num1 * num2}}</p>
<p>{{num1 / num2}}</p>
<p>{{num1 + num2 * num3}}</p>

<!-- 二元关系 -->
<p>{{num1 > num2}}</p>
<p>{{num1 !== num2}}</p>

<!-- 括号 -->
<p>{{a * (b + c)}}</p>
```

`注意`：双向绑定仅支持普通变量和属性访问表达式。



过滤器
------

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

过滤器在组件声明时注册，具体请参考组件文档。

