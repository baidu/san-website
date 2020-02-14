---
title: How to use san-router to create a back-end system for a single-page application?
categories:
- practice
---

#### Introduction

As we all know, the early routing of the Web system is implemented by the backend, and the server reloads the entire page based on the URL. This kind of user experience is not only bad, but if the page becomes complicated, the pressure on the server side will also become larger. With the widespread use of Ajax, pages can update data without refreshing the browser, which also lays the foundation for the emergence of single-page applications and front-end routing. Therefore, the use of front-end routing in a single-page application system is also very common, and many front-end frameworks also provide or recommend a matching routing system. San-router is the official router of the San framework, which is designed to make it easy for users to build single-page or homogeneous applications based on san. This article also focuses on how to use san-router to build a single-page back-end management system during practice.


#### Router Config

Systems that use san-router and San to build single-page applications are primarily based on routing and components. The routing process is placed on the browser side to directly respond to the transformation of the browser address and distribute it to the corresponding route. When the route changes, the corresponding interface is presented to the user by loading the corresponding component and replacing the part that needs to be changed. So routing configuration is a relatively important step.

A single-page application should create an entry js file (such as main.js ) in which you can configure the relevant route, attach a root component, and set the target of the route to the label in the root component:

```javascript
// main.js

import san from 'san';
import {router} from 'san-router';
import App from './App.san';

// attach 根组件 App
new App().attach(document.getElementById('app'));
// 路由规则
const routes = [
    {
        rule: '/',
        Component: Home
    },
    {
      rule: '/list',
      Component: List
    },
    {
      rule: '/about',
      Component: About
    }
];
// Set the target property of the routing rule to the label in the root component
routes.forEach(item => {
    router.add({
        ...item,
        target: '#main'
    });
});
// set router mode to 'html5 | hash'
router.setMode('html5');
// set router listen
router.listen((e, config) => {
    // trigger when router changes
    console.log(e);
    console.log(config);
});
// start router
router.start();

```

In the routing rule configuration process, the routing rules are added by calling router.add({Object}options), and the Component and target parameters are specified in the options object. Maps specific URL rules to the corresponding component class, and when the URL changes and matches the routing rules, the corresponding logical subcomponent is initialized and rendered into the page.

> san-router has two routing rule configurations:
> When rule is string, the path part of the URL matches the string exactly.
> rule is RegExp (regular), the path part of the URL matches the regular part

After the routing rules are configured, you can set the routing mode by calling the setMode method, and add the route listener by calling the listen method, which is triggered when the routing behavior occurs.

Finally, you can start the route by calling the start method, matching the rules based on the changes in the URL, and rendering the corresponding components to the interface.


#### App root component

As the root component, the App lays out the parts of the entire system interface that do not need to be updated, and builds the basic skeleton of the system interface. The part that needs to be updated is to load different logical components by launching the route after the App component is attached to the page, and render it to the label corresponding to the target attribute of the routing rule:


```javascript
// App.san

// Link Component
import {Link} from 'san-router';

// App Component
class App extends san.Component {
    static components = {
      'router-link': Link
    };
    static template = `
          <div class="app-container">
            <div class="app-drawer">
                <div class="drawer-title">
                  <h3>XXX Manage System</h3>
                </div>
                <div class="menu">
                    <ul>
                        <li><router-link to="/">Home</router-link></li>
                        <li><router-link to="/list">List</router-link></li>
                        <li><router-link to="/about">about</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="app-bar">
                <div class="user-info">
                    <span>userName</span>
                </div>
            </div>
            <div class="app-content">
              <!-- Logical component rendering here -->
              <div id="main"></div>
            </div>
           </div>
    `;
}
```


#### Logical subcomponent

A logical subcomponent is a business logic component that is rendered into a page based on a route matching rule. These components are assembled from the components in the base component library according to the business logic, and are initialized and rendered when they match the corresponding route.

The logical subcomponents are regular san components. Each logical subcomponent can be placed in a separate file, called by the basic component library, to set up the business to be processed in different lifecycle phases:

```javascript
// About.san

class About extends san.Component {
    static template = `
        <p>About us</p>
    `;
    initData() {
        return {};
    }
    route() {}
    attached() {}
}

// List.san

class List extends san.Component {
    static template =  `
        <p>list,list</p>
    `;
    initData() {
        return {};
    }
    route() {}
    attached() {}
}

// Home.san

class Home extends san.Component {
    static template = `
        <p>Home</p>
    `;
    initData() {
        return {};
    }
    route() {}
    attached() {}
}
```


#### Conclusion

The key to constructing a single-page application back-end system using san-router is the three aspects of routing configuration, root components and logical sub-components. If you can do these three aspects gracefully, you can reuse them in the later development and expansion process. Components and modules to increase development efficiency. In addition, single-page applications are based on front-end routing, componentization ideas, and front-end data flow scenarios. Therefore, when constructing a single-page application system, it is also necessary to pay attention to front-end data stream management. For a back-end management system with complex and variable services, multiplexing components, effectively managing Ajax requests and front-end data streams can improve development and maintenance efficiency. Therefore, single-page applications are also widely used in practice, but each technical solution has its limitations. Single-page applications need to provide all functions on one page. For the first time, a large amount of resources need to be loaded, and resource loading time is relatively long. The technical solution also needs to take into account the specific application scenarios.

#### Example

<p data-height="265" data-theme-id="0" data-slug-hash="VzQeZm" data-default-tab="js,result" data-user="sqliang" data-embed-version="2" data-pen-title="san-router-spa" class="codepen">See the Pen <a href="https://codepen.io/sqliang/pen/VzQeZm/">san-router-spa</a> by sqliang (<a href="https://codepen.io/sqliang">@sqliang</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
