---
title: data bind时的auto camel
categories:
- practice
---

在 san 组件中，data 的键值必须遵守 camelCase (驼峰式)的命名规范，不得使用 kebab-case (短横线隔开式)规范。

## 场景一

当一个父组件调用子组件并进行 data 绑定时，如果某一项属性写法使用了 kebab-case，san 会自动将其转换为 camelCase，然后传入子组件。下面的一个例子说明了这一点：

### 示例一

```javascript
class Child extends san.Component {
  static template = `
    <ol>
      <li>{{dataParent}}</li>
      <li>{{data-parent}}</li> 
    </ol>
  `;
}

class Parent extends san.Component {
  static template = `
    <div>
      <san-child data-parent="data from parent!"/>
    </div>
  `;

  static components = {
    'san-child': Child
  };
}

new Parent().attach(document.body);
```

<p data-height="265" data-theme-id="0" data-slug-hash="vJQgWm" data-default-tab="js,result" data-user="mly-zju" data-embed-version="2" data-pen-title="vJQgWm" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/vJQgWm/">vJQgWm</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 分析

上面例子中，父组件调用子组件，为`data-parent`属性传入了"data from parent!"字符串。在子组件中，同时在li标签中输出`dataParent`和`data-parent`属性的值，可以看到，`dataParent`打印出的正是父组件绑定的值，作为对比，`data-parent`并没有输出我们期望的绑定值。从这个例子中可以很明显看出，对于传入的属性键值，san会自动将 kebab-case 写法转换为 camelCase。而作为对比，在原生 html 标签中，并不会有 auto-camel 的特性，我们如果传入一个自定义的 kebab-case 写法的属性，依然可以通过`dom.getAttribute('kebab-case')`来进行读取。san 的 template 与原生 html 的这一点不同值得我们注意。

在这个场景中的 auto camel 是很有迷惑性的，这个特性很容易让我们误以为在开发中，定义组件的属性键值时候我们可以随心所欲的混用 camelCase 和 kebab-case，因为反正 san 会自动帮我们转换为 camelCase 形式。那么，实际上是不是如此呢？来看场景二。

##  场景二

在场景一中，父组件为子组件绑定了一个 kebab-case 写法的属性，被自动转换为 camelCase。那么在子组件中，如果自身返回的初始 data 属性本身就是 kebab-case 类型，又会出现怎样的情况呢？我们看第二个例子：

### 示例二

```javascript
class Child extends san.Component {
  static template = `
    <ol>
      <li>{{dataSelf}}</li>
      <li>{{data-self}}</li> 
    </ol>
  `;

  initData() {
    return {
      'data-self': 'data from myself!'
    }
  }
}

new Child().attach(document.body);
```

<p data-height="265" data-theme-id="0" data-slug-hash="QMJpvL" data-default-tab="js,result" data-user="mly-zju" data-embed-version="2" data-pen-title="QMJpvL" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/QMJpvL/">QMJpvL</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 分析

在上面例子中，Child 组件初始 data 中包含一项键值为`data-self`的数据。我们将其分别以`dataSelf`和`data-self`打印到 li 标签中，可以看到，两种都没有正确打印出我们初始化的值。说明对于自身 data 属性而言，如果属性的键值不是 camelCase 的形式，san 并不会对其进行 auto camel 转换，所以我们无论以哪种方式，都无法拿到这个数据。

##  原理分析

在 san 的 compile 过程中，对 template 的解析会返回一个 ANODE 类的实例。其中 template 中绑定属性的时候，属性对象的信息会解析为 ANODE 实例中的 props 属性。对于子组件来说，会根据父组件的 aNode.props 来生成自身的 data binds。

在 san 中，非根组件做 data binds 过程中，接受父组件的 aNode.props 这一步时，会做 auto camel 处理。这就解释了上述两个例子为什么父组件 kebab 属性传入后，子组件 camel 属性表现正常，其余情况都是异常的。事实上在 san 的源码中，我们可以找到相关的处理函数：

```javascript
function kebab2camel(source) {
    return source.replace(/-([a-z])/g, function (match, alpha) {
        return alpha.toUpperCase();
    });
}

function camelComponentBinds(binds) {
    var result = new IndexedList();
    binds.each(function (bind) {
        result.push({
            name: kebab2camel(bind.name),
            expr: bind.expr,
            x: bind.x,
            raw: bind.raw
        });
    });

    return result;
}
```

在生成子组件的绑定过程中，正是由于调用了 camelComponentBinds 这个函数，所以才有 auto camel 的特性。

##  结论

san 的 auto camel 只适用于父组件调用子组件时候的数据绑定。对于一个组件自身的初始数据，如果属性为 kebab-case，我们将无法正确拿到数据。因此，在写 san 组件的过程中，无论何时，对于 data 中的属性键值，我们都应该自觉地严格遵循 camelCase 规范。