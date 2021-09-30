---
title: 背景
categories:
- tutorial
---

引言
-----

2008年，V8 引擎随 Chrome 浏览器横空出世，JavaScript 这门通用的 Web 脚本语言的执行效率得到质的提升。 V8 引擎的出现，注定是 JavaScript 发展史上一个光辉的里程碑。它的出现，让当时研究高性能服务器开发、长时间一筹莫展的 [Ryan Dahl](http://tinyclouds.org/) 有了新的、合适的选择，不久，在2009年的柏林的 JSConf 大会上，基于 JavaScript 的服务端项目 Node.js 正式对外发布。Node.js 的发布，不仅为开发者带来了一个高性能的服务器，还很大程度上推动了前端的工程化，带来了前端的大繁荣。与此同时，因为 JavaScript 执行效率的巨大提升，越来越多的业务逻辑开始在浏览器端实现，前端逻辑越来越重，前端架构随之提上日程。于是，我们谈论的主角，MVVM 模式，走进了 Web 前端的架构设计中。

概念
-----

MVVM 模式，顾名思义即 Model-View-ViewModel 模式。它萌芽于2005年微软推出的基于 Windows 的用户界面框架 WPF ，前端最早的 MVVM 框架 [knockout](https://github.com/knockout/knockout) 在2010年发布。

一句话总结 Web 前端 MVVM：操作数据，就是操作视图，就是操作 DOM（所以无须操作 DOM ）。

无须操作 DOM ！借助 MVVM 框架，开发者只需完成包含 **声明绑定** 的视图模板，编写 ViewModel 中业务数据变更逻辑，View 层则完全实现了自动化。这将极大的降低前端应用的操作复杂度、极大提升应用的开发效率。MVVM 最标志性的特性就是 **数据绑定** ，MVVM 的核心理念就是通过 **声明式的数据绑定** 来实现 View 层和其他层的分离。完全解耦 View 层这种理念，也使得 Web 前端的单元测试用例编写变得更容易。

MVVM，说到底还是一种分层架构。它的分层如下：

- Model: 域模型，用于持久化
- View: 作为视图模板存在
- ViewModel: 作为视图的模型，为视图服务

### Model 层

Model 层，对应数据层的域模型，它主要做`域模型的同步`。通过 Ajax/fetch 等 API 完成客户端和服务端业务 Model 的同步。在层间关系里，它主要用于抽象出 ViewModel 中视图的 Model。

### View 层

View 层，作为视图模板存在，在 MVVM 里，整个 View 是一个动态模板。除了定义结构、布局外，它展示的是 ViewModel 层的数据和状态。View 层不负责处理状态，View 层做的是 **数据绑定的声明**、 **指令的声明**、 **事件绑定的声明**。

### ViewModel 层

ViewModel 层把 View 层需要的数据暴露，并对 View 层的 **数据绑定声明**、 **指令声明**、 **事件绑定声明** 负责，也就是处理 View 层的具体业务逻辑。ViewModel 底层会做好绑定属性的监听。当 ViewModel 中数据变化，View 层会得到更新；而当 View 中声明了数据的双向绑定（通常是表单元素），框架也会监听 View 层（表单）值的变化。一旦值变化，View 层绑定的 ViewModel 中的数据也会得到自动更新。

### 前端 MVVM 图示

<img src="https://raw.githubusercontent.com/X-Jray/blog/master/assets/mvvm.png" width="540" alt="前端MVVM">

如图所示，在前端 MVVM 框架中，往往没有清晰、独立的 Model 层。在实际业务开发中，我们通常按 **Web Component** 规范来组件化的开发应用，Model 层的域模型往往分散在在一个或几个 Component 的 ViewModel 层，而 ViewModel 层也会引入一些 View 层相关的中间状态，目的就是为了更好的为 View 层服务。

开发者在 View 层的视图模板中声明 **数据绑定**、 **事件绑定** 后，在 ViewModel 中进行业务逻辑的 **数据** 处理。事件触发后，ViewModel 中 **数据** 变更， View 层自动更新。因为 MVVM 框架的引入，开发者只需关注业务逻辑、完成数据抽象、聚焦数据，MVVM 的视图引擎会帮你搞定 View。因为数据驱动，一切变得更加简单。

MVVM框架的工作
-----

不可置否，MVVM 框架极大的提升了应用的开发效率。It's amazing！But，MVVM 框架到底做了什么？

- 视图引擎

视图引擎：我是视图引擎，我为 View 层作为视图模板提供强力支持，开发者，你们不需要操作 DOM ，丢给我来做！

- 数据存取器

数据存取器：我是数据存取器，我可以通过 `Object.defineProperty()` API 轻松定义，或通过自行封装存取函数的方式曲线完成。我的内部往往封装了 **发布/订阅模式**，以此来完成对数据的监听、数据变更时通知更新。我是 **数据绑定** 实现的基础。

- 组件机制

组件机制：我是组件机制。有追求的开发者往往希望按照面向未来的组件标准 － **Web Components** 的方式开发，我是为了满足你的追求而生。MVVM 框架提供组件的定义、继承、生命周期、组件间通信机制，为开发者面向未来开发点亮明灯。

- more...

结语
-----

>有了前端 MVVM 框架，应用开发如此简单!

前端 MVVM 已是趋势，是大型 Web 应用开发效率提升的利器。由百度 EFE 出品的 MVVM 框架 － [san](https://baidu.github.io/san/)，在保持功能强大、特性支持完整的前提下，还兼顾到IE8的市场份额，对老版本浏览器提供了良好的兼容性，更难能可贵的是 GZip 后体积仅 **11k**， 现已为百度内多个产品提供了强劲驱动，可谓百度 EFE 又一精工之作！开源的 [san](https://baidu.github.io/san/) 欢迎广大开发者体验、使用，更欢迎广大开发者加入到 [san 生态](https://github.com/baidu?utf8=%E2%9C%93&q=san&type=&language=) 的建设中来，让 [san](https://baidu.github.io/san/) 变得更好！