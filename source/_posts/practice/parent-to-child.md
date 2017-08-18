---
title: 父组件如何更新子组件？
categories:
- practice
---

#### props

最简单的也是最常用的父组件更新子组件的方式就是父组件将数据通过**props**传给子组件，当相关的变量被更新的时候，MVVM框架会自动将数据的更新映射到视图上。


```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's name: {{firstName}}</p>
        </div>
    `;
};

class Parent extends san.Component {
    static template = `
        <div>
             <input value="{= firstName =}" placeholder="please input">
             <ui-son firstName="{{firstName}}"/>
        </div>
    `;

    static components = {
        'ui-son': Son
    };

    initData() {
        return {
            firstName: 'trump'
        }
    }
};
```

<p data-height="365" data-theme-id="dark" data-slug-hash="qXPRxR" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-prop" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/qXPRxR/">san-parent-to-child-prop</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### ref
更灵活的方式是通过**ref**拿到子组件的实例，通过这个子组件的实例可以手动调用`this.data.set`来更新子组件的数据，或者直接调用子组件声明时定义的成员方法。

```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's: {{firstName}}</p>
        </div>
    `;
};

class Parent extends san.Component {
    static template = `
        <div>
            <input value="{= firstName =}" placeholder="please input">
            <button on-click='onClick'>传给子组件</button>
            <ui-son san-ref="son"/>
        </div>
    `;
    static components = {
      'ui-son': Son
    };
    onClick() {
      this.ref('son').data.set('firstName', this.data.get('firstName'));
    }
}
```

<p data-height="365" data-theme-id="dark" data-slug-hash="wqrgGj" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-ref" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/wqrgGj/">san-parent-to-child-ref</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### message

除了**ref**外，父组件在接收子组件向上传递的消息的时候，也可以拿到子组件的实例，之后的操作方式就和上面所说的一样了。

```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's name: {{firstName}}</p>
            <button on-click='onClick'>I want a name</button>
        </div>
    `;

    onClick() {
        this.dispatch('son-clicked');
    }
};

class Parent extends san.Component {
    static template = `
        <div>
             <input value="{= firstName =}" placeholder="please input">
             <ui-son/>
        </div>
    `;

    // 声明组件要处理的消息
    static messages = {
        'son-clicked': function (arg) {
            let son = arg.target;
            let firstName = this.data.get('firstName');
            son.data.set('firstName', firstName);
        }
    };

    static components = {
        'ui-son': Son
    };

    initData() {
        return {
            firstName: 'trump'
        }
    }
};
```

<p data-height="365" data-theme-id="dark" data-slug-hash="ZJXLGZ" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-prop" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/ZJXLGZ/">san-parent-to-child-prop</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
