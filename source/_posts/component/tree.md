---
title: 组件树结构
categories:
- component
---


我们知道组件体系下，组件必须是可嵌套的树形关系。下面从一段代码，做一些说明。在下面的代码中，AddForm 内部使用了两个自定义组件：ui-calendar 和 ui-timepicker。

```html
<!-- Template -->
<div class="form">
    <input type="text" class="form-title" placeholder="标题" value="{= title =}">
    <textarea class="form-desc" placeholder="备注" value="{= desc =}"></textarea>

    <div>预期完成时间：
        <ui-calendar value="{= endTimeDate =}" s-ref="endDate"></ui-calendar>
        <ui-timepicker value="{= endTimeHour =}" s-ref="endHour"></ui-timepicker>
    </div>

    <div class="form-op">
        <button type="button" on-click="submit">ok</button>
    </div>
</div>
```

```javascript
var AddForm = san.defineComponent({
    // template

    components: {
        'ui-timepicker': require('../ui/TimePicker'),
        'ui-calendar': require('../ui/Calendar')
    },

    submit: function () {
        this.ref('endDate')
        this.ref('endHour')
    }
});
```


## components

组件中通常通过声明自定义元素，使用其它组件。

组件视图可以使用哪些子组件类型，必须通过定义组件的 **components** 成员指定。key 是自定义元素的标签名，value 是组件的类。

`注意`：考虑到组件的独立性，San 没有提供全局组件注册的方法，组件必须在自身的 **components** 中声明自己内部会用到哪些组件。

有些组件可能在内容中会使用自己，比如树的节点。我们可以将 **components** 中这一项的值设置为字符串 **self**。

```javascript
var Node = san.defineComponent({
    // template

    components: {
        'ui-node': 'self'
    }
});
```

## owner 与 parent

**owner** 与 **parent** 的概念已经被 react 明确过了，但这里还是要专门明确下。

**owner** 指的是目标在声明时位于哪个组件的组件视图中，其生存时间、交互的通信等行为都由 **owner** 管理。**owner** 必须是一个组件。ui-calendar 的 **owner** 是 AddForm 组件。

**parent** 指的是目标在视图中对应的直接父级元素。ui-calendar 的 **parent** 是其上层的 div。**parent** 对组件管理并没有直接的意义。


## ref

声明子组件时，如果通过 **s-ref** 指定了名称，则可以在owner组件实例的 **ref** 方法调用到。

`提示`：有了声明式的初始化、数据绑定与事件绑定，我们很少需要在 owner 中拿到子组件的实例。虽然 San 提供了这个途径，但当你用到它的时候，请先思考是不是非要这么干。


## 消息

通过 **dispatch** 方法，组件可以向组件树的上层派发消息。

```javascript
var SelectItem = san.defineComponent({
    template: '<li on-click="select"><slot></slot></li>',

    select: function () {
        var value = this.data.get('value');

        // 向组件树的上层派发消息
        this.dispatch('UI:select-item-selected', value);
    }
});
```

消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件，则停止。通过 **messages** 可以声明组件要处理的消息。**messages** 是一个对象，key 是消息名称，value 是消息处理的函数，接收一个包含 target(派发消息的组件) 和 value(消息的值) 的参数对象。

```javascript
var Select = san.defineComponent({
    template: '<ul><slot></slot></ul>',

    // 声明组件要处理的消息
    messages: {
        'UI:select-item-selected': function (arg) {
            var value = arg.value;
            this.data.set('value', value);

            // arg.target 可以拿到派发消息的组件
        }
    }
});
```

消息主要用于组件与非 **owner** 的上层组件进行通信。比如，slot 内组件 SelectItem 的 **owner** 是更上层的组件，但它需要和 Select 进行通信。

```javascript
san.defineComponent({
    components: {
        'ui-select': Select,
        'ui-selectitem': SelectItem
    },

    template: ''
        + '<div>'
        + '  <ui-select value="{=value=}">'
        + '    <ui-selectitem value="1">one</ui-selectitem>'
        + '    <ui-selectitem value="2">two</ui-selectitem>'
        + '    <ui-selectitem value="3">three</ui-selectitem>'
        + '  </ui-select>'
        + '</div>'
});
```


## 动态子组件

在 3.10.0 以上的版本，支持 `s-is` 指令，在渲染过程动态选择组件类型。`s-is` 特性有以下要点：

- `s-is` 可以声明一个表达式，其运算结果 **应该** 是一个 string
- 动态选择的组件类型是在 `components` 中声明的子组件，`s-is` 表达式运算结果对应 `components` 声明中的 **key**

```javascript
var BLabel = san.defineComponent({
    template: '<b>{{text}}</b>'
});

var ULabel = san.defineComponent({
    template: '<u>{{text}}</u>'
});

var App = san.defineComponent({
    components: {
        'BLabel': BLabel,
        'ULabel': ULabel
    },

    template: '<div><x-label s-is="type" text="{{name}}"/></div>'
});

(new App({
    data: {
        name: 'San',
        type: 'BLabel'
    }
})).attach(document.body);
```

## 手动创建子组件

在一些场景下，我们不希望组件通过声明式，在自身视图渲染时创建子组件；而希望通过 JavaScript 灵活控制在未来的某些时间点创建子组件。比如：

- 浮动层子组件的 **parent** 不在其根元素 **el** 内，声明式用着不方便
- 列表只有在用户点击时才需要创建并展示


手动创建子组件对开发者要求更高，我们在这里给出一些需要注意的地方，下面节选的代码也做了一些简单的说明：

- 手动创建的子组件无需在 `components` 中声明类型
- 确保不要重复创建。常见的做法是在实例的属性上持有对创建组件的引用，并以此作判断

```javascript
san.defineComponent({
    mainClick: function () {
        if (!this.layer) {
            this.layer = new Layer();
            this.layer.attach(document.body);
        }

        this.layer.show();
    },

    disposed: function () {
        if (this.layer) {
            this.layer.dispose();
        }

        this.layer = null;
    }
});
```

在 3.7.0 以上的版本，手动创建的子组件支持 owner 和 source 参数。

指定 owner 可以自动维护 owner 与手动创建的子组件之间的关系：

- owner 可以收到手动创建的子组件 dispatch 的消息
- owner dispose 时，手动创建的子组件将自动 dispose

`注意`：

指定 owner 后，不允许将组件 push 到 owner 的 children 中，否则组件 dispose 过程中，会对手动创建的子组件进行多次 dispose 操作。


source 可以声明手动创建的子组件与 owner 之间的绑定关系：

- 数据绑定，含双向绑定
- 事件




```javascript
// 手动创建的子组件的数据与事件绑定，指定owner和source
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '  <button on-click="done">Done</button>'
        + '</div>',

    done: function () {
        this.fire('done', {
            name: this.data.get('name'),
            email: this.data.get('email')
        });
    }
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{{author.name}}" email="{{author.email}}" on-done="editDone($event)"/>'
            });
            this.editor.attach(document.body)
        }
    },

    editDone: function (e) {
        this.data.set('author', e);
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```


```javascript
// 手动创建的子组件双向绑定，指定owner和source
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '</div>'
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{=author.name=}" email="{=author.email=}"/>'
            });
            this.editor.attach(document.body)
        }
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```


```javascript
// 手动创建的子组件指定owner，可以dispatch
// 3.7.0+
var Person = san.defineComponent({
    template: '<div>'
        + '  <input type="text" value="{=name=}">'
        + '  <input type="text" value="{=email=}">'
        + '  <button on-click="done">Done</button>'
        + '</div>',

    done: function () {
        this.dispatch('person-done', {
            name: this.data.get('name'),
            email: this.data.get('email')
        });
    }
});

var MyApp = san.defineComponent({
    template: '<div>'
        + '  name: {{author.name}}; email{{author.email}}'
        + '  <button on-click="edit">edit</button>'
        + '</div>',

    edit: function () {
        if (!this.editor) {
            this.editor = new Person({
                owner: this,
                source: '<x-person name="{{author.name}}" email="{{author.email}}"/>'
            });
            this.editor.attach(document.body)
        }
    },

    messages: {
        'person-done': function (e) {
            this.data.set('author', e.value);
        }
    }
});

var myApp = new MyApp({
    data: {
        author: {
            name: 'erik',
            email: 'errorrik@gmail.com'
        }
    }
});
myApp.attach(document.body);
```

`提示`：如果你的组件包含指定 source 声明的手动创建的子组件，并且预期会被循环多次创建，可以将 source 模板手动预编译，避免框架对 source 字符串进行多次重复编译，提升性能。

```javascript
// 手工预编译 source
// 3.7.0+
var PersonDetail = san.defineComponent({
    template: '<div>'
        + '  {{name}}, {{email}}'
        + '  <button on-click="close">close</button>'
        + '</div>',

    close: function () { this.el.style.display = 'none' },
    open: function () { this.el.style.display = 'block' }
});

var Person = san.defineComponent({
    template: '<div>'
        + '  name: {{info.name}}'
        + '  <button on-click="showDetail">detail</button>'
        + '</div>',

    // 手工预编译 source
    detailSource: san.parseTemplate('<x-person name="{{info.name}}" email="{{info.email}}"/>')
        .children[0],

    showDetail: function () {
        if (!this.detail) {
            this.detail = new PersonDetail({
                owner: this,
                source: this.detailSource
            });
            this.detail.attach(document.body)
        }

        this.detail.open();
    }
});

var MyApp = san.defineComponent({
    template: '<div><x-p s-for="p in members" info="{{p}}" /></div>',

    components: {
        'x-p': Person
    }
});

var myApp = new MyApp({
    data: {
        members: [
            { name: 'errorrik', email: 'errorrik@what.com' },
            { name: 'otakustay', email: 'otakustay@what.com' }
        ]
    }
});
```

在 3.7.1 以上的版本，手动创建的子组件的 source 参数允许声明子元素，指定插入 slot 部分的内容。


```javascript
// 指定插入 slot 部分的内容
// 3.7.1+
var Dialog = san.defineComponent({
    template: '<span><slot name="title"/><slot/></span>'
});

var MyApp = san.defineComponent({
    template: '<div><button on-click="alterStrong">alter strong</button></div>',

    attached: function () {
        if (!this.dialog) {
            this.dialog = new Dialog({
                owner: this,
                source: '<x-dialog>'
                    + '<h2 slot="title">{{title}}</h2>'
                    + '<b s-if="strongContent">{{content}}</b><u s-else>{{content}}</u>'
                    + '</x-dialog>'
            });
            this.dialog.attach(this.el);
        }
    },

    alterStrong: function () {
        this.data.set('strongContent', !this.data.get('strongContent'));
    }
});

var myApp = new MyApp({
    data: {
        title: 'MyDialog',
        content: 'Hello San',
        strongContent: true
    }
});
```