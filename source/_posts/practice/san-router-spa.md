---
title: 如何使用san-router构建一个单页应用的后台系统
categories:
- practice
---

#### 引言

众所周知，Web 系统的早期路由是由后端来实现的，服务器根据 URL 来重新加载整个页面。这种做法用户体验不但不好，而且页面若是变得复杂，服务器端的压力也会随之变大。随着 Ajax 的广泛应用，页面能够做到无需刷新浏览器也可更新数据，这也给单页应用和前端路由的出现奠定了基础。因此，在单页应用系统中使用前端路由也十分常见，很多前端框架也提供或者推荐配套使用的路由系统。san-router 是 San 框架的官方 router ，以方便用户基于 san 构建单页或同构应用为目标。本文也主要来说明实践过程中如何使用 san-router 来构建一个单页面后台管理系统。


#### 路由配置
使用 san-router 和 San 构建单页应用的系统主要基于路由和组件。路由处理放在浏览器端来直接响应浏览器地址的变换，分发到对应的路由。在路由发生变化时，通过加载相应的组件，替换需要改变的部分，来向用户呈现对应的界面。所以路由配置是比较关键的一步。

单页应用系统中应该创建一个入口 js 文件(如 main.js ),在其中可以配置相关路由, attach 一个根组件,并将路由的 target 设置为根组件中的标签:

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
// 将路由规则的 target 属性设置为根组件中的标签
routes.forEach(item => {
    router.add({
        ...item,
        target: '#main'
    });
});
// 设置路由模式 'html5 | hash'
router.setMode('html5');
// 设置路由监听
router.listen((e, config) => {
    // 在路由发生变化时触发
    console.log(e);
    console.log(config);
});
// 启动路由
router.start();

```


在路由规则配置过程中,通过调用 router.add({Object}options) 来添加路由规则,在 options 对象中指定 Component 和 target 参数。将特定的 URL 规则映射到相应的组件类上,在 URL 变化并匹配路由规则时,将对应逻辑子组件初始化并渲染到页面中。

> san-router 有两种路由规则配置:
> rule 为 string 时,URL 的 path 部分与字符串完全匹配才可;
> rule 为 RegExp (正则)时, URL 的 path 部分与该正则部分匹配即可。

路由规则配置完成后,可以通过调用 setMode 方法来设置路由模式;通过调用 listen 方法来添加路由监听器,当发生路由行为时被触发。

最后,可通过调用 start 方法来启动路由,根据 URL 的变化来匹配规则,渲染相应的组件到界面上。


#### App根组件

App 作为根组件,布局了整个系统界面不需要更新的部分,搭建出了系统界面基本的骨架。那些需要更新的部分则是在 App 组件被附加到页面后,通过启动路由,来加载不同的逻辑组件,渲染到路由规则 target 属性对应的标签里:


```javascript
// App.san

// Link 组件
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
                  <h3>XXX管理系统</h3>
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
              <!-- 逻辑组件渲染处 -->
              <div id="main"></div>
            </div>
           </div>
    `;
}
```


#### 逻辑子组件

逻辑子组件是指根据路由匹配规则渲染到页面中的业务逻辑组件。这些组件按照业务逻辑,由基础组件库中的组件组装而成,在匹配到对应路由时,进行初始化和渲染。

逻辑子组件是正规的 san 组件,每一个逻辑子组件可以放在一个单独的文件里,调用基本组件库来组装而成,设置在不同生命周期阶段想要处理的业务:

```javascript
// About.san

class About extends san.Component {
    static template = `
        <p>关于关于</p>
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


#### 总结

使用 san-router 构建一个单页应用后台系统的关键点在路由配置、根组件和逻辑子组件三个方面,如果能优雅地做好以上三个方面,就能在后期开发与扩展过程中复用组件和模块,提高开发效率。另外,单页应用基于前端路由、组件化思想和前端数据流方案。因此,在构建一个单页应用系统时,还需关注前端数据流管理,对于业务比较复杂多变的后台管理系统,复用组件、有效管理 Ajax 请求和前端数据流有利于提高开发和维护效率。

因此,在实践中单页应用也被广泛应用,但是每种技术方案有其局限性,单页应用要在一个页面上提供所有功能,首次需要加载大量资源,资源加载时间也相对较长,这点在选择技术方案时还需要兼顾具体应用场景。

#### 示例

<p data-height="265" data-theme-id="0" data-slug-hash="VzQeZm" data-default-tab="js,result" data-user="sqliang" data-embed-version="2" data-pen-title="san-router-spa" class="codepen">See the Pen <a href="https://codepen.io/sqliang/pen/VzQeZm/">san-router-spa</a> by sqliang (<a href="https://codepen.io/sqliang">@sqliang</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
