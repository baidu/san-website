---
title: 插槽
categories:
- tutorial
---



在视图模板中可以通过 slot 声明一个插槽的位置，其位置的内容可以由外层组件定义。

```javascript
var Panel = san.defineComponent({
    template: '<div>'
        + '  <div class="head" on-click="toggle">title</div>'
        + '  <p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
        + '</div>',

    toggle: function () {
        this.data.set('fold', !this.data.get('fold'));
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-panel': Panel
    },

    template: '<div><ui-panel>Hello San</ui-panel></div>'
});

/* MyComponent渲染结果
<div>
  <div class="head">title</div>
  <p style="display:none">Hello San</p>
</div>
*/
```

HTML 标准关于 slot 的描述可以参考 [这里](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#slots)


数据环境
-------

插入 slot 部分的内容，其数据环境为 **声明时的环境**。

```javascript
var Panel = san.defineComponent({
    template: '<div>'
        + '  <div class="head" on-click="toggle">title</div>'
        + '  <p><slot></slot></p>'
        + '</div>',

    initData: function () {
        return {name: 'Panel'};
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-panel': Panel
    },

    template: '<div><ui-panel>I am {{name}}</ui-panel></div>',

    initData: function () {
        return {name: 'MyComponent'};
    }
});

/* MyComponent渲染结果
<div>
  <div class="head">title</div>
  <p>I am MyComponent</p>
</div>
*/
```

命名
-----

通过 name 属性可以给 slot 命名。一个视图模板的声明可以包含一个默认 slot 和多个命名 slot。外层组件的元素通过 `slot="name"` 的属性声明，可以指定自身的插入点。

`注意`：slot 是声明时定义，所以 slot 命名只能是静态的名称，不能使用运行时数据定义 slot name。

```javascript
var Tab = san.defineComponent({
    template: '<div>'
        + '  <header><slot name="title"></slot></header>'
        + '  <main><slot></slot></main>'
        + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: '<div><ui-tab>'
        + '<h3 slot="title">1</h3><p>one</p>'
        + '<h3 slot="title">2</h3><p>two</p>'
        + '</ui-tab></div>'
});

/* MyComponent渲染结果
<div>
  <header><h3>1</h3><h3>2</h3></header>
  <main><p>one</p><p>two</p></main>
</div>
*/
```

`注意`：外层组件的替换元素，只有在直接子元素上才能声明 `slot="name"` 指定自身的插入点。下面例子中的 a 元素无法被插入 title slot。

```javascript
var Tab = san.defineComponent({
    template: '<div>'
        + '  <header><slot name="title"></slot></header>'
        + '  <main><slot></slot></main>'
        + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-tab': Tab
    },

    template: '<div><ui-tab>'
        + '<h3 slot="title">1</h3><p>one</p>'
        + '<h3 slot="title">2</h3><p>two<a slot="title">slot fail</a></p>'
        + '</ui-tab></div>'
});

/* MyComponent渲染结果，a 元素无法被插入 title slot
<div>
  <header><h3>1</h3><h3>2</h3></header>
  <main><p>one</p><p>two<a>slot fail</a></p></main>
</div>
*/
```

动态插槽
-----

在 slot 声明时应用 if 或 for 指令，可以让插槽根据组件数据动态化。


### if指令

下面的例子中，panel 的 hidden 属性为 true 时，panel 中默认插槽将不会渲染，仅包含 title 插槽，通过 slot 方法获取的数组长度为 0。

```javascript
var Panel = san.defineComponent({
    template: '<div><slot name="title"/><slot s-if="!hidden"/></div>',
});

var MyComponent = san.defineComponent({
    components: {
      'x-panel': Panel
    },

    template: ''
        + '<div>'
          + '<x-panel hidden="{{folderHidden}}" s-ref="panel">'
              + '<b slot="title">{{name}}</b>'
              + '<p>{{desc}}</p>'
          + '</x-panel>'
        + '</div>',

    attached: function () {
        // 0
        this.ref('panel').slot().length
    }
});


var myComponent = new MyComponent({
    data: {
        folderHidden: true,
        desc: 'MVVM component framework',
        name: 'San'
    }
});
```

### for指令

下面的例子没什么用，纯粹为了演示 slot 上应用 for 指令。在后续 **scoped 插槽** 章节中可以看到有意义的场景。

```javascript
var Panel = san.defineComponent({
    template: '<div><slot s-for="item in data"/></div>',
});

var MyComponent = san.defineComponent({
    components: {
      'x-panel': Panel
    },

    template: ''
        + '<div>'
          + '<x-panel data="{{panelData}}" s-ref="panel">'
              + '<p>{{name}}</p>'
          + '</x-panel>'
        + '</div>',

    attached: function () {
        // 0
        this.ref('panel').slot().length
    }
});


var myComponent = new MyComponent({
    data: {
        panelData: [1, 2, 3],
        name: 'San'
    }
});

/* MyComponent渲染结果，<p>{{name}}</p>输出 3 遍
<div>
    <p>San</p>
    <p>San</p>
    <p>San</p>
</div>
*/
```



scoped 插槽
-----

如果 slot 声明中包含 1 个以上 **var-** 数据前缀声明，该 slot 为 scoped slot。scoped slot 具有独立的 **数据环境**，其中仅包含 **var-** 声明的数据。scoped 数据声明的形式为 **var-name="expression"**。

scoped slot 通常用于组件的视图部分期望由 **外部传入视图结构**，渲染过程使用组件内部数据。下面是典型的列表数据渲染场景：


```javascript
var Men = san.defineComponent({
    template: '<div>'
      + '<slot s-for="item in data" var-n="item.name" var-email="item.email" var-sex="item.sex ? \'male\' : \'female\'">'
        + '<p>{{n}},{{sex}},{{email}}</p>'
      + '</slot>'
      + '</div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-men': Men
    },

    template: '<div><x-men data="{{men}}" s-ref="men">'
          + '<h3>{{n}}</h3>'
          + '<p><b>{{sex}}</b><u>{{email}}</u></p>'
        + '</x-men></div>',

    attached: function () {
        var slots = this.ref('men').slot();

        // 3
        slots.length

        // truthy
        slots[0].isInserted

        // truthy
        contentSlot.isScoped
    }
});

var myComponent = new MyComponent({
    data: {
        men: [
            {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
            {name: 'leeight', sex: 0, email: 'leeight@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
        ]
    }
});

/* MyComponent渲染结果
<div>
    <h3>errorrik</h3>
    <p><b>male</b><u>errorrik@gmail.com</u></p>
    <h3>leeight</h3>
    <p><b>female</b><u>leeight@gmail.com</u></p>
    <h3>otakustay</h3>
    <p><b>male</b><u>otakustay@gmail.com</u></p>
</div>
*/
```

`注意`：scoped slot 中不支持双向绑定。

