---
title: 属性透传
categories:
- tutorial
---


`版本`：>= 3.14.1

属性透传的意思是，组件的使用者，在使用时在组件的根元素上附加自己想要添加的 Element Attribute。通常，这种用法一般用在 data-* / aria-* / role 等自定义属性，在元素上注入一些自身业务逻辑相关的内容。


## 声明属性透传

在模版中通过 **attr-** 前缀，可以声明透传的属性。

```js
var Inner = san.defineComponent({
    template: '<span><slot/></span>'
});

var MyComponent = san.defineComponent({
    template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

    components: {
        'ui-inner': Inner
    }
});

var myComponent = new MyComponent({
    data: {
        text: 'Hello'
    }
});

var wrap = document.createElement('div');
document.body.appendChild(wrap);
myComponent.attach(wrap);

// result html
// <div><span title="Hello" data-t="state:Hello">Hello</span></div>
```

[模版组件](../../component/template-component/)也支持属性透传功能。

```js
var Inner = san.defineTemplateComponent({
    template: '<span><slot/></span>'
});

var MyComponent = san.defineComponent({
    template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

    components: {
        'ui-inner': Inner
    }
});

var myComponent = new MyComponent({
    data: {
        text: 'Hello'
    }
});

var wrap = document.createElement('div');
document.body.appendChild(wrap);
myComponent.attach(wrap);

// result html
// <div><span title="Hello" data-t="state:Hello">Hello</span></div>
```


## 关闭属性透传

通过设置组件的 **inheritAttrs** 属性为 **false**，可以关闭属性透传功能。当 inheritAttrs 为 false 时，id / class / style 的属性透传也会被关闭。

```js
var Inner = san.defineComponent({
    inheritAttrs: false,
    template: '<span><slot/></span>'
});

var MyComponent = san.defineComponent({
    template: '<div><ui-inner attr-title="{{text}}" class="test">{{text}}</ui-inner></div>',

    components: {
        'ui-inner': Inner
    }
});

var myComponent = new MyComponent({
    data: {
        text: 'Hello'
    }
});

var wrap = document.createElement('div');
document.body.appendChild(wrap);
myComponent.attach(wrap);

// result html
// <div><span>Hello</span></div>
```


## 属性透传与 data

在组件内部，可以通过 **$attrs** 数据项，获取到外部透传的属性值。

```js
var attrs = this.data.get('$attrs');
```

`提示`：即使将 inheritAttrs 设置为 false，也能获得 $attrs data


## 透传到内部元素

有时候，组件内部有复杂的结构元素，实际具有意义的元素在更深的层次下。我们希望属性透传作用到内部 **实际具有意义的元素** 上。这时候我们可以：

- 通过 inheritAttrs 把属性透传关闭
- 在对应元素上使用 s-bind + $attrs

```js
var Inner = san.defineComponent({
    inheritAttrs: false,
    template: '<p><span s-bind="$attrs"><slot/></span></p>'
});

var MyComponent = san.defineComponent({
    template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

    components: {
        'ui-inner': Inner
    }
});

var myComponent = new MyComponent({
    data: {
        text: 'Hello'
    }
});

var wrap = document.createElement('div');
document.body.appendChild(wrap);
myComponent.attach(wrap);

// result html
// <div><p><span title="Hello" data-t="state:Hello">Hello</span></p></div>
```

