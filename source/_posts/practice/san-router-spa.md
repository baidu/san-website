---
title: 如何使用san-router构建一个单页应用的后台系统
categories:
- practice
---

#### 引言

众所周知，Web系统的早期路由是由后端来实现的，服务器根据url来重新加载整个页面。这种做法用户体验不但不好，而且页面若是变得复杂，服务器端的压力也会随之变大。随着ajax的广泛应用，页面能够做到无需刷新浏览器也可更新数据，这也给单页应用和前端路由的出现奠定了基础。因此，在单页应用系统中使用前端路由也十分常见，很多前端框架也提供或者推荐配套使用的路由系统。[san-router](https://github.com/ecomfe/san-router)是[San](https://ecomfe.github.io/san/)框架的官方router，以方便用户在基于san构建单页或同构应用为目标。本文也主要来说明实践过程中如何使用san-router来构建一个单页面后台管理系统。

> 完整代码示例：https://github.com/sqliang/san-router-spa

#### 系统整体结构

使用san-router和San构建单页应用的后台系统主要基于路由和组件。路由处理放在浏览器端来直接响应浏览器地址的变换，分发到对应的路由。在路由发生变化时，不再刷新整个页面，而是通过加载、组合相应的组件，替换需要改变的部分，来向用户呈现对应的界面。整体结构如下图所示：

![](/assets/spa_san_router.png)

由图可知，整个单页应用后台系统有如下几个特点：
1. 整个项目只有一个html文件，即index.html。在用户访问系统浏览器起初只加载index.html，根据index.html的入口引用加载相关资源文件。
2. main.js为index.html入口引用文件，在创建App组件实例时传入router.js相关路由配置，来达到根据路由加载逻辑组件的目的。
3. 逻辑组件由多个基础组件组合拼装而成。在路由发生变化时，加载不同的逻辑组件，从而达到向用户呈现对应界面的效果。

#### 系统入口文件解析

index.html作为单页应用系统的html入口文件,会引用加载相关资源文件:

```html
// index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>XXX管理系统</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Webpack是目前使用比较广泛的一款模块加载打包工具,能把各种资源作为模块来使用和处理。因此,单页应用系统的开发可以使用Webpack进行相关配置,本文单页index.html引用的入口main.js也是使用Webpack来配置(具体参考示例代码和网上资料)的:

```
// webpack.base.conf.js

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  // ...
}
```

main.js主要创建App组件实例附加到id为app的div中,使App组件成为为本文单页后台系统的基本模板。另外,实例创建过程中通过传入配置好的路由对象,来加载不同的逻辑组件:

```
// main.js

// 引入style样式
import 'font-awesome/css/font-awesome.min.css';
import 'normalize.css/normalize.css';
import 'san-mui/lib/index.css';
import './main.css';

// 引入路由
import router from './router';
 
import App from './App.san';

// 创建App实例,传入路由配置
new App({
    data: {
        router
    }
}).attach(document.getElementById('app'));

```

App.san作为基本模板组件,通过使用引用基础组件,布局了整个系统界面不需要更新的部分,那些需要更新的部分则是在App组件被附加到页面后通过调用startRoute()函数来启动路由。

startRoute函数中可以根据传入的router对象来设置路由模式,路由监听,然后启动路由。由此也就可以根据路由的配置,在路由发生变化时,加载不同的逻辑组件,更新数据,呈现给用户不同的界面。

```
<template>
<div class="app-container">
    // ...
    
    <div class="app-content">
        // 逻辑组件加载到id为main的DOM内
        <div id="main"></div>
    </div>
    
    // ...
</div>
</template>
<script>
export default {
    // ...
    
    attached() {
        // 使路由生效
        this.startRoute();
    },
    startRoute() {
        const router = this.data.get('router');
        //路由监听
        router.listen((e, config) => { // e为路由信息对象, config为路由配置对象
            this.data.set('menuVal', config.rule);
        });
        // 路由模式 'html5 | hash'
        router.setMode('html5');
        router.start();
    }
    
    // ...
}

// ...
</script>

```

#### 路由配置

san-router的router对象用于将特定的URL对应到相应组件类上,在URL变化并匹配路由规则时,将对应组件初始化并渲染到页面中。
因此,我们可以通过调用router.add({Object}options)来添加路由规则。在options对象中指定Component和target参数,当规则匹配时将对应Component渲染到target上。

> san-router有2种路由规则配置:
> rule为string时,URL的path部分与字符串完全匹配才可
> rule为RegExp(正则)时,URL的path部分与该正则部分匹配即可
> 详细请参考: https://github.com/ecomfe/san-router

```javascript
// router.js
import {router} from 'san-router';

import routes from './routes';

routes.forEach(item => {
    router.add({
        ...item,
        target: '#main'
    });
});

export default router;


// routes.js
import Home from './pages/Home/Home.san';
import About from './pages/About/About.san';
import List from './pages/List/List.san';
import Add from './pages/Add/Add.san';
import Edit from './pages/Edit/Edit.san';

export default [
    {
        rule: '/',
        Component: Home
    },
    {
        rule: '/about',
        Component: About
    },
    {
        rule: '/list',
        Component: List
    },
    {
        rule: '/list/tag/:tag_id',
        Component: List
    },
    {
        rule: '/add',
        Component: Add
    },
    {
        rule: '/edit/:id',
        Component: Edit
    }
];

```

#### 逻辑组件说明

本文逻辑组件即为通过路由对象渲染到页面中的业务逻辑组件。这些组件(Home,List, About, Add, Edit等)按照业务逻辑,由基础组件库中的组件组装而成,在匹配到对应路由时,进行渲染。

#### 总结

单页应用基于前端路由、组件化思想和前端数据流方案。因此,在构建一个单页应用系统时,需要重点关注路由,组件和数据流方案这三个环节。对于业务比较复杂多变的后台管理系统,复用组件、有效管理ajax请求和前端数据流有利于提高开发和运维效率。所以,在实践中单页应用也成为被广泛应用。但是,每种技术方案也有其局限性,单页应用要在一个页面上提供所有功能,首次需要加载大量资源,资源加载时间也相对较长。
