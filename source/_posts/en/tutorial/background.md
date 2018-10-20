---
title: Background
categories:
- tutorial
---

Introduction
-----

Chrome released V8 JavaScript engine in 2008 which enormously improved the performance of JavaScript. The emergence of V8 engine is destined to be a significant milestone in the history of JavaScript development.

It provides the best choice for [Ryan Dahl](http://tinyclouds.org/), wanted to develop a high-performance server with no progress for a long time.

Soon after, at JSConf Berlin 2009, JavaScript-based server project Node.js was officially released.

It gives JavaScript developers a high-performance server and brought prosperity to front-end tooling.

In the meantime, because of the performance improved, more and more business logic migrate from server side to browser.

Browser-side business logic becomes complex, and developers realized that they need a framework to solve these problems.

San, the JavaScript MVVM framework. The architecture solution for web development. 

Concept
-----

MVVM(Model-View-ViewModel) pattern. Is first introduced in WPF framework from windows user application framework in 2005. 

The earliest JavaScript MVVM framework -- [knockout](https://github.com/knockout/knockout), was released in 2010. 

With MVVM pattern, data maps to views, and there is no need to write any code to operate the DOM. All the DOM mutations are taken over by MVVM frameworks. 

JavaScript developers only need to write declarative templates and concentrate on the business logic and application data in ViewModel. 

The template will update automatically when the bound data changed. This design significantly reduces the complexity of the application while increase the efficiency of application development.

The most significant feature of MVVM pattern is **data bindings**. It use **data bindings** syntax to separate the View layer from other layers without any UI code. Unit test becomes more easier.

After all, MVVM pattern is a hierarchical architecture, organized as followed: 

- Model: used to store persistent data
- View: the templates including **data bindings** syntax
- ViewModel: the reflection of template in data's perspective, automatically syncs view changes. 

### Model

The model layer is used to store data. We can sync data between client server with AJAX/fetch API. Is used to abstract the View's Model of ViewModel in layer relations. 

### View

View: the template. In MVVM pattern, Entire View is a dynamic template. It shows the ViewModel's data and state besides of structure and layout. View does not deal with component state, the main character of View is to declare data binding, commands, and events.

### ViewModel

ViewModel exports the data which View needs and controls View's data binding, commands, event declarations. 

Developers write custom business logic code to process the data from View. When the data from ViewModel changed, View will get updated automatically; when View declares the two-way bindings, the framework will bind event handlers to the DOM, and update ViewModel's data upon user inputs.

### MVVM diagram

<img src="https://raw.githubusercontent.com/X-Jray/blog/master/assets/mvvm.png" width="540" alt="前端MVVM">

In MVVM framework. There is no clear boundary to determine which kind of code belongs to Model in MVVM frameworks. In actual production development, we usually use **Web Component** standard to manage our code. The concept of Model is sometimes separated into one or many component's ViewModel, and ViewModel have some temporary state, to better serve the View layer/

Developers write declarative data and bindings in the View template, and write business logic in ViewModel. Whenever a event is fired, the data of ViewModel will change and View will update. With the power of MVVM framework, developers only need to focus on business logic, the abstraction of data and MVVM framework will help you make everything right in the View. Data-driven make everything simpler.

What MVVM framework do
-----
MVVM can increase the productivity of application development. It's amazing! But, what's actually inside a MVVM framework?

- View Engine

View Engine: full support of template parsing and rendering. As a developer, you don't need to known what is DOM and how to operate it.

- Data Store

Data store: implemented by `Object.defineProperty()` API, or completed by self-encapsulating functions. Integrated with pub/sub patten to watch the data changes and subscribe the view to update when changing the data. This is the basic of **data bindings**.

- Component Mechanism

Component Mechanism: Cutting edge developers frequently ask for a development style aligned to the future proof standard - Web Component. San was born to satisfy your pursuit. The MVVM framework provides component definition, inheritance, lifecycle, and cross-component communication mechanisms to enable developers to develop bright lights for the future.

- more...

The end
-----

> With MVVM framework, application development more simple any more!

MVVM framework had been a trend, a tool for improving the efficiency of large-scale Web application development. San was produced by Baidu EFE - [San](https://baidu.github.io/San/); A JavaScript framework compatible with IE8 with all the powerful and complete features of MVVM. What is more valuable is that the GZipped source code is only **11k** in size. There are large products in Baidu based on the San. It is another masterpiece of Baidu EFE! MVVM is already the trend; it's the most powerful techniques for large web applications. [San](https://baidu.github.io/San/) is an open source project and contributions always welcome. We warmly welcome developers to join the San Ecosystem and make San better and better.