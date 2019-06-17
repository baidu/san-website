---
title: IE兼容性问题以及解决方案
categories:
- practice
---

### 开始
San 本身的API是支持IE6以上的，但是在实际开发过程中，多多少少会碰到IE的一些兼容性问题,但是兼容性问题的本质就是新旧浏览器环境对不同API支持程度的不同导致的问题，本章主要梳理了一些常用的关于JS的解决思路。

### 通用方案1 -- @babel/polyfill

`@babel/polyfill` 帮我们做的事情是模拟了一个ES6+的环境，让我们能够愉快地使用最新的ES6+的APIs，我们在使用的时候要确保它在其他代码或者引用前被调用（比如可以在入口文件中直接引入）。

`npm install --save @babel/polyfill`

```javascript
# 引入方式1

require("@babel/polyfill");


# 引入方式2

import "@babel/polyfill";


# 引入方式3--在webpack的entry入口处添加

module.exports = {
  entry:['@babel/polyfill','src/index.js']
}
```
但是在实际开发过程中，我们用不到所有的兼容包代码，这就让我们的代码体积变的很大，这里我们可以使用babel的配置来按需加载
```javascript
# .babelrc
{
  "presets": [["@babel/preset-env", {
    "useBuiltIns": "usage", //如果我们配置了该项 就不需要在webpack中配置entry了
    "corejs": 3
  }]]
}
```
### 通用方案2 -- 条件注释 按需引入es5-shim.js & es5-sham.js 等库
```javascript
# es5-shim.js & es5-sham.js 解决ES5语法不兼容问题
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-sham.min.js"></script>

# es6-shim.js & es6-sham.js 解决ES6语法不兼容问题
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js"></script>

# es7-shim 解决ES6+语法不兼容问题
<script src="https://wzrd.in/standalone/es7-shim@latest"></script>
```
```javascript
# IE 6/7 与部分 IE8 浏览器不支持 JSON 对象的情况
<script src="https://cdnjs.cloudflare.com/ajax/libs/json2/20160511/json2.min.js"></script>
或
<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
```
在实际开发中，我们不用全部都引入，这些库为我们解决了不兼容ES5，ES6语法的情况，为我们提供了一系列API重写的代码（原理是把一个库引入一个旧的浏览器, 然后用旧的API, 实现一些新的API的功能）

典型不兼容的就是 IE 6/7/8 的浏览器,目前的 Chrome ，FireFox ，IE9+ 都是支持 ES5+ 语法的，所以为了使用这些库，我们可以配合使用一些`条件注释`来辅助我们引入这些库，而不是全部的浏览器都引入
```javascript
# IE版本 小于等于9
<!--[if lt IE 9]>
	<script src="es5-shim/es5-shim.min.js"></script>
	<script src="es5-shim/es5-sham.min.js"></script>
	<script src="/json2/json2.min.js"></script>
<![endif]-->
```
>针对`条件注释`不是很明白的同学，可以参考这篇文章 https://www.cnblogs.com/dtdxrk/archive/2012/03/06/2381868.html


>以上方案只能解决部分问题，在实际开发过程中，肯定会遇到一些其他问题，但是对于JS的兼容性问题只要保持着，没有这个API可以通过重写或者HACK的方式来解决，以下是一些单个情况的解决方案
### Case1 : `default` `class` `catch` ES3 保留字问题
```javascript
SCRIPTxxx: 缺少标识符
```
```javascript
# 不识别default
e.n = function (t) {
    var n = t && t.__esModule ? function () {
        return t.default
    } : function () {
        return t
    };
    return e.d(n, "a", n), n
}
```

```javascript
# webpack中配置 es3ify-loader
npm intall --save-dev es3ify-loader post-loader

module: {
    rules: [{
            test: /.js$/,
            enforce: 'post', // post-loader处理
            loader: 'es3ify-loader'
        }
    ]
}
```
```javascript
// 编译前
function(t) { return t.default; }

// 编译后
function(t) { return t["default"]; } #这里将保留字添加字符串进行引入
```
### Case2 : `Object.defineProperty` 问题
这是因为我们使用了`import & export`语法，ES6 Module语法在通过`babel`编译后会产生`Object.defineProperty`的问题，在IE8下只能对DOM对象使用, 如果对原生对象使用Object.defineProtry()会报错，引用了一系列库之后其实也并非可以解决该问题，这里找到一个方案仅供参考
```javascript
(function () {
  if (!Object.defineProperty ||
    !(function () {
      try {
        Object.defineProperty({}, 'x', {});
        return true;
      } catch (e) {
        return false;
      }
    }())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) {
        try {
          return orig(o, prop, desc);
        } catch (e) {}
      }

      if (o !== Object(o)) {
        throw TypeError("Object.defineProperty called on non-object");
      }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());
```

### Case3 : 在IE6和IE7浏览器中，支持`Element.querySelectorAll` & `Element.querySelectorAll`方法
```javascript
if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'),
      elements = [],
      element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
var qsaWorker = (function () {
  var idAllocator = 10000;

  function qsaWorkerShim(element, selector) {
    var needsID = element.id === "";
    if (needsID) {
      ++idAllocator;
      element.id = "__qsa" + idAllocator;
    }
    try {
      return document.querySelectorAll("#" + element.id + " " + selector);
    } finally {
      if (needsID) {
        element.id = "";
      }
    }
  }

  function qsaWorkerWrap(element, selector) {
    return element.querySelectorAll(selector);
  }

  // Return the one this browser wants to use
  return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();
```

### Case4 : IE 不支持`Object.assign`
```javascript
if (typeof Object.assign != 'function') {
  Object.assign = function (target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}     
```
### Case5:  在IE8下不支持 webpack4打包代码中的`getter/setter` 访问器属性
在使用webpack4+san的过程中，IE8以下无法支持webpack4打包代码中的getter/setter访问器属性,这里建议可以更换其他构建工具来进行打包


> IE的问题还有很多，比如css样式的不兼容问题等等，这里只是提供了一些解决办法，无法做到全部囊括，后面会不断补充，最后感谢董睿大神提供这次梳理文章的机会～ 欢迎一起交流
