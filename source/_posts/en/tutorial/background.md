---
title: Background
categories:
- tutorial
---

Introduction
-----

Chrome released the V8 JavaScript engine in 2008 and enormously improved the performance of JavaScript. 

The emergence of the V8 engine is destined to be a significant milestone in the history of JavaScript development.

It provides the best choice for [Ryan Dahl](http://tinyclouds.org/), who want to write a high-performance server and with no progress for a long time.

Soon after, at the JSConf in Berlin in 2009, JavaScript-based server project Node.js officially released.

It gives JavaScript developer a high-performance server and highly promotes workflow tools for Front-End development.

In the meantime, because of the performance improved, more and more business logic migrate from server side to browser.

Browser-side business logic becomes complex, and developer realized that they need a framework to solve these problems.

San, the MVVM JavaScript framework. The architecture solution for web development. 

Concept
-----

MVVM(Model-View-ViewModel) pattern. First invented in WPF framework from windows user application framework in 2005. 

The earliest MVVM JavaScript framework -- [knockout](https://github.com/knockout/knockout), was released in 2010. 

With MVVM pattern, data are equal to views, and there is no need to write any code to operate the DOM. All the DOM mutations are take over by MVVM frameworks. 

JavaScript developer only need to write template including **declare bindings syntax**, the business logic focused on application data in ViewModel. 

The template will update automatically when the binding data changed. This design deeply reduces the complexity of the application and increase the efficiency of application development.

The most significant feature of MVVM pattern is the **data bindings**. It use **data bindings** syntax to separate the View layer from other layers and without any UI code. Unit test code becomes more easily.

After all, MVVM pattern is a Hierarchical architecture, organized as followed: 

- Model: used to store persistence data
- View: the template including **data bindings** syntax
- ViewModel: the mirror of template in data ways, auto sync changes with view. 

### Model

Modal layer. The model used to store data. Use Ajax/fetch API to keep client and server data sync. It used to abstract the View's Model of ViewModel in layer relations. 


### View

View: the template. In MVVM pattern, The whole View is a dynamic template. It shows the ViewModel's data and state besides of structure and layout. View does not deal with component state, the main character of View is to declare data bindings, commands, and events.

### ViewModel

ViewModel exports the data which View needed and control View's data bindings, commands, event declaring. 

Developers write custom business logic code to process the data from View. When the data from ViewModel changed, View will get updated automatically; When View declare the two-way bindings syntax, the framework will add the event handler to the DOM, and update the ViewModel's data when DOM get user's input.

### MVVM diagram

<img src="https://raw.githubusercontent.com/X-Jray/blog/master/assets/mvvm.png" width="540" alt="前端MVVM">

In MVVM framework. There is no distinct boundary of which kinds of code belong to Model. In actual production development, we usually use **Web Component** standard to manage our code. The concept of Model sometimes been separated in one or many component's ViewModel, and ViewModel have some temporary state, to better serve the View layer/

Developer write **declare bindings**, **event bind** in the View template, and write business logic process in ViewModel. After the event fired, the data of ViewModel changed and View updating automatically. With the power of MVVM framework, developers only need to focus on business logic, the abstraction of data and MVVM framework will help you make everything right in the View. Data-driven make everything simpler.

What MVVM framework do
-----
MVVM can increase the productivity of application development. It's amazing! But, what MVVM framework do?

- View Engine

View Engine: fully support for template parsing and rendering. As a developer, you don't need to known what is DOM and how to operate it.

- Data Store

Data store: implemented by `Object.defineProperty()` API, or completed by self-encapsulating functions. Integrated with pub/sub patten to watch the data changed and subscribe the view to update when changing the data. This is the basic of **data bindings**.

- Component Mechanism

Component Mechanism: Developer who have highly pursue hope to use the next generation of the component standard -- **Web Components**. San was born to satisfy your pursuit. The MVVM framework provides component definition, inheritance, lifecycle, and inter-component communication mechanisms to enable developers to develop bright lights for the future.

- more...

The end
-----

> With MVVM framework, application development more simple any more!

MVVM framework had been a trend, a tool for improving the efficiency of large-scale Web application development. San was produced by Baidu EFE - [San](https://baidu.github.io/San/); A JavaScript framework compatible with IE8 with all the powerful and complete features of MVVM. What is more valuable is that the GZipped source code is only **11k** in size. There are large products in Baidu based on the San. It is another masterpiece of Baidu EFE! MVVM is already the trend; it's the most powerful techniques for large web applications. [San](https://baidu.github.io/San/) is an open source project and contributions always welcome. We warmly welcome developers to join the San Ecosystem and make San better and better.