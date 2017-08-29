---
title: data bind时的auto camel
categories:
- practice
---

san组件中，data的键值必须遵守camelCase(驼峰式)的命名规范，不得使用kebab-case(短横线隔开式)规范。

## 场景一

当一个父组件调用子组件并进行data绑定时，如果某一项属性写法使用了kebab-case，san会自动将其转换为camelCase，然后传入子组件。下面的一个例子说明了这一点：

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

<p data-height="265" data-theme-id="0" data-slug-hash="vJQgWm" data-default-tab="result" data-user="mly-zju" data-embed-version="2" data-pen-title="vJQgWm" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/vJQgWm/">vJQgWm</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 分析

上面例子中，父组件调用子组件，为`data-parent`属性传入了"data from parent!"字符串。在子组件中，同时在li标签中输出`dataParent`和`data-parent`属性的值，可以看到，`dataParent`打印出的正是父组件绑定的值，作为对比，`data-parent`并没有输出我们期望的绑定值。从这个例子中可以很明显看出，对于传入的属性键值，san会自动将kebab-case写法转换为camelCase。而作为对比，在原生html标签中，并不会有auto-camel的特性，我们如果传入一个自定义的kebab-case写法的属性，依然可以通过`dom.getAttribute('kebab-case')`来进行读取。san的template与原生html的这一点不同值得我们注意。

在这个场景中的auto camel是很有迷惑性的，这个特性很容易让我们误以为在开发中，定义组件的属性键值时候我们可以随心所欲的混用camelCase和kebab-case，因为反正san会自动帮我们转换为camelCase形式。那么，实际上是不是如此呢？来看场景二。

##  场景二

在场景一中，父组件为子组件绑定了一个kebab-case写法的属性，被自动转换为camelCase。那么在子组件中，如果自身返回的初始data属性本身就是kebab-case类型，又会出现怎样的情况呢？我们看第二个例子：

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

<p data-height="265" data-theme-id="0" data-slug-hash="QMJpvL" data-default-tab="result" data-user="mly-zju" data-embed-version="2" data-pen-title="QMJpvL" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/QMJpvL/">QMJpvL</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 分析

在上面例子中，Child组件初始data中包含一项键值为`data-self`的数据。我们将其分别以`dataSelf`和`data-self`打印到li标签中，可以看到，两种都没有正确打印出我们初始化的值。说明对于自身data属性而言，如果属性的键值不是camelCase的形式，san并不会对其进行auto camel转换，所以我们无论以哪种方式，都无法拿到这个数据。

##  结论

san的auto camel只适用于父组件调用子组件时候的数据绑定。对于一个组件自身的初始数据，如果属性为kebab-case，我们将无法正确拿到数据。因此，在写san组件的过程中，无论何时，对于data中的属性键值，我们都应该自觉地严格遵循camelCase规范。