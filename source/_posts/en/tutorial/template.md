---
title: Template
categories:
- tutorial
---

 San uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the underlying San instance’s data. 


Scenes
-----

### Interpolation

Like many template engines, the syntax of interpolation is that the expression is in double braces, and can be followed by any number of filters.

```
{{ expr [[| filter-call1] | filter-call2...] }}
```

In the text content area, we can use interpolation to replace.

```html
<p>Hello {{name}}!</p>
```

Within the attributes of the HTML tag, we can also use interpolation to replace.

```html
<span title="This is {{name}}">{{name}}</span>
```

Interpolated data can be processed using filters.

```html
<p>Hello {{name | upper}}!</p>
```

`Expression`: In the double braces of interpolation substitution, San provides a wealth of expression support; please refer to [expression](#expression) section for details.

`Filter`: For a description of the filter, please refer to the [Filter](#Filter) section.


`tips`: Interpolation will default to HTML escaping. If you don't need HTML escaping, please refer to the [Output HTML] (#Output HTML) section later in this article.


### property binding


As the name suggests, property binding means binding data to the properties of a child component. The way of the property binding is the same as the interpolation binding, and the property declaration is passed through the HTML tag. The way of the attribute binding is the same as the interpolation binding, which is declared through the attributes of the HTML tag. And usaslly we only declare one **{{ expression }}**.

In the following example, when the jokeName data changes, the new value is automatically set to the text property of the label component.

```html
<ui-label text="{{jokeName}}"></ui-label>
```


`expression`: Attribute binding supports any type of expression. Please refer to the [expression](#expression) section for details.

### overall propertys binding

`version`：>= 3.5.8

By **s-bind**, you can bind the entire data to a component. When **s-bind** coexists with a single property binding, a single property binding overrides the corresponding data item in the overall binding.

```html
<ui-label s-bind="{{ {text: email, title: name} }}"></ui-label>

<!-- `text` of a-single-property-binding overrides `text` of s-bind -->
<ui-label s-bind="{{ {text: email, title: name} }}" text="{{name}}"></ui-label>
```


`tips`: Two-way binding only supports primitive type and property accessor exprssion. Otherwise, it may lead to unpredictable problems.

### two-way binding

Two-way binding is possible through the HTML tag's attribute to declare **{= expression =}**.

Two-way bindings typically appear in the **user input** scenario, which automatically updates user input results to component data. So we usually apply two-way binding to the ** input form element** or **custom component with input feedback**.

The following example establishes a two-way binding between the declared data item (name, online, color) and the value attribute of input, or select, or custom components. When the user enters, the value of the corresponding data item changes.

```html
<input type="text" value="{= name =}">

<select value="{= online =}">
    <option value="errorrik">errorrik</option>
    <option value="otakustay">otakustay</option>
    <option value="firede">firede</option>
</select>

<ui-colorpicker value="{= color =}"></ui-colorpicker>
```

`expression`: 


Raw HTML
------

Sometimes we want to output real HTML not be escaped. There are two ways to do this in San.

1. `s-html` directive
2. `raw` filter. It is a virtual filter

```html
<p s-html="rawHTML"></p>
<p>{{rawHTML | raw}}</p>
```


Expression
------

San provides rich expression type support, making it easier for users to write view templates.

- data access(primitive type and property accessor exprssion)
- unitary NOT
- unitary negative `>= 3.6.6`
- two-number operation
- two-number relationship
- ternary conditional operation
- brackets
- string
- number
- boolean
- array literal `>= 3.5.9`
- object literal `>= 3.5.9`
- method call `>= 3.6.11`


Below, the supported expression types are listed by examples of interpolating.

```html
<!-- primitive type -->
<p>{{name}}</p>

<!-- property accessor exprssion -->
<p>{{person.name}}</p>
<p>{{persons[1]}}</p>

<!-- unitary NOT -->
<p>{{!isOK}}</p>
<p>{{!!isOK}}</p>

<!-- unitary negative -->
<p>{{-num1 + num2}}</p>

<!-- two-number operation -->
<p>{{num1 + num2}}</p>
<p>{{num1 - num2}}</p>
<p>{{num1 * num2}}</p>
<p>{{num1 / num2}}</p>
<p>{{num1 + num2 * num3}}</p>

<!-- two-number relationship -->
<p>{{num1 > num2}}</p>
<p>{{num1 !== num2}}</p>

<!-- ternary conditional operation -->
<p>{{num1 > num2 ? num1 : num2}}</p>

<!-- brackets -->
<p>{{a * (b + c)}}</p>

<!-- number -->
<p>{{num1 + 200}}</p>

<!-- string + ternary conditional operation -->
<p>{{item ? ',' + item : ''}}</p>

<!-- array literal -->
<x-list data="{{ persons || [] }}" />

<!-- object literal -->
<x-article data="{{ {title: articleTitle, author: user} }}" />

<!-- method call -->
<p>{{max(num1, num2)}}</p>
```

`tips`: two-way binding only supports primitive type and property accessor expression.


data computation in view
------

We often encounter scenarios where the ** view shows that the data is not the original value**, such as the formatted date, the relative time of last modified time based on the current time, and so on. In these scenarios, we can use the following methods to process and transform the data.

- filter
- method call


### filter


When interpolating, the filter can process and transform the interpolated data into a more suitable data for view rendering. `tips`: Filters are only supported when interpolating。

Interpolating supports multi-filter processing. The filter is similar to the pipe, and the output of the previous filter is used as the input of the latter filter and is passed backward.

```html
<!-- primitive type -->
<p>{{myVariable | html | url}}</p>
```

Filters support parameter passing, parameters can be any supported [expressions](#expression)。

```html
<!-- // Suppose there is a filter: comma -->
<p>{{myVariable | comma(3)}}</p>
<p>{{myVariable | comma(commaLength)}}</p>
<p>{{myVariable | comma(commaLength + 1)}}</p>
```

The filter is registered when the component is declared. For details, please refer to the [filters](../component/#filter)。


### Method call

`>= 3.6.11`

The methods declared in the component can be called directly in the template.

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

- `pros`: Method calls are sometimes more intuitive than [filters] (#filters). For example, the scene of `sum` will be a bit awkward through [filter] (#filter).
- `cons`: [Filter] (#Filter) Lets the data processing and transformation methods for the view are placed in filters, and the methods on the component can focus on view-independent logic behavior. This is broken if a method call is used.

```javascript
// Implementing `sum` through filter is a bit awkward
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

Method calls can dynamically select methods, but the first level must be static.

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

In the method called, you can continue to call other methods on the component through this.

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

`warning`: Using method calls, the method can access all of the component's data through this.data at runtime. However, don't do this, otherwise, it will cause an implicit dependency on the data, causing the view to not update as the data changes. Below are examples of errors and correctness.

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

`tips`: If you use a method call, the method you call is preferably a pure function with no side effects.


HTML Entities
------

When we write HTML, if the content contains reserved characters or special characters of HTML, we need to write the HTML entity. San's template HTML is self-parsing, and due to its volume, only limited named HTML entities are supported:

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

Other than that, we can use numbered character entities like `&#[entity_number];` or `&#x[entity_number];`.

```html
<p>LiLei &#38; HanMeiMei are a couple.</p>
<p>1 + 1 &#60; 3</p>
```

