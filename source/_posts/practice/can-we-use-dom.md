---
title: 我们可以操作 DOM 吗？
categories:
- practice
---


我们在使用 San 的时候，特别是刚刚入坑，且 MVVM 框架的经验不是那么丰富，我们还是更习惯于使用 jQuery 作为类库来操作页面的交互，于是很自然的写出了这样的代码。

```
var MyApp = san.defineComponent({
    template: '<input value="没点" class="ipt"/><button class="btn"></button>',
    attached: function () {
        this.bindSomeEvents();
    },
    bindSomeEvents: function () {
        $('.btn').click(()=>{
            $('.ipt').val('点了');
        });
    }
});
var myApp = new MyApp();
myApp.attach(document.querySelector('#app'));
```

然后用浏览器运行了这段程序，结果完全符合预期，完美~

然而当我们进一步熟悉了 San 的套路后对于上面的功能我们会写出这样的代码。

```
var MyApp = san.defineComponent({
    template: '<div><input value="{{value}}"/><button on-click="clickHandler">点我</button></div>',
    initData: function () {
        return {
            value: '没点'
        };
    },
    clickHandler: function () {
        this.data.set('value', '点了')
    }
});
var myApp = new MyApp();
myApp.attach(document.querySelector('#app'));
```

仔细推敲了下这两段代码，不禁产生了一个疑问。

直观的来看，San 的代码中我们直接调用 this.data.set 来修改某个属性的值，它自动将修改后的内容渲染到了 DOM 上，似乎看起来非常的神奇，但是它的根本上还是对 DOM 进行的操作，只不过这个操作是San框架帮你完成的，既然是这样，那我们为什么不能直接像第一段代码一样，直接修改，而要把这些操作交给 San 来完成呢？如果从性能上考虑交给 San 来做，它要完成从 Model 到视图上的关系绑定，还需要有一部分性能的损失，这样看起来代价还挺大的，那我们为什么还要这么做呢？

带着这个问题，我们可以从这几方面进行考虑。

### 你干嘛要用 San 呢？

San 是一个 MVVM（Model-View-ViewModel） 的组件框架，借助 MVVM 框架，我们只需完成包含 **声明绑定** 的视图模板，编写 ViewModel 中业务数据变更逻辑，View 层则完全实现了自动化。这将极大的降低前端应用的操作复杂度、极大提升应用的开发效率。MVVM 最标志性的特性就是 **数据绑定** ，MVVM 的核心理念就是通过 **声明式的数据绑定** 来实现 View 层和其他层的分离。完全解耦 View 层这种理念，也使得 Web 前端的单元测试用例编写变得更容易。

简单来说就是：操作数据，就是操作视图，也就是操作 DOM。

### 此 DOM 非彼 DOM

在我们写的代码中的 template 属性，在 San 中被称作 **内容模板**，它是一个符合 HTML 语法规则的字符串，它会被 San 解析，返回一个 [ANode](https://github.com/ecomfe/san/blob/master/doc/anode.md) 对象。

也就是说我们在 template 中写的东西实际上并不是要放到 DOM 上的，它是给 San 使用的，真正生成的 DOM 实际上是 San 根据你的 template 的解析结果也就是 ANode 生成的，你的代码与DOM之间其实还隔了一层 San。

显然我们如果直接使用原生的 api 或者 jQuery 来直接操作 San 生成的DOM，这是不合理的，因为那些DOM根本不是我们写的，而我们却要去修改它，还真是多管闲事。

不直接操做 DOM 这其实也是符合计算机领域中分层架构设计的基本原则的，每一层完成独立的功能，然后上层通过调用底层的 api 来使用底层暴露出来的功能，但禁止跨层的调用。

### 有时候我们过度的考虑了性能这个问题

San 框架极大的提升了应用的开发效率，它帮我们屏蔽繁琐的 DOM 操作，帮我们处理了 Model 与 View的关系，这看起来真的很美好，但一切美好的事情总是要付出代价的，San要做这些，就会带来性能上的开销，所以它用起来比直接操做 DOM 性能要差，这是毋庸置疑的，世界上也不可能存在这种框架性能比直接操作 DOM 还要好，如果你要改变一个页面的显示状态，DOM 是它的唯一 API，任何框架都不可能绕过。

但这种性能上的消耗真的给我的应用带来的不可维护的问题了吗，反而是大部分原因是因为我们在开发中代码结构的不合理，代码不够规范，功能划分不够清晰，等一系列主观上的问题导致的项目无法维护下去。

### 总之

在我们的项目中选择 San 做为框架，它不仅可以让你从繁琐的 DOM 操作中解脱出来，通过 MVVM 的模式极大的降低前端应用的操作复杂度、极大提升应用的开发效率，它的组件系统作为一个独立的数据、逻辑、视图的封装单元更是能够帮你很好的在开发中梳理好应用的代码结构，保证系统能够更加易于维护。


