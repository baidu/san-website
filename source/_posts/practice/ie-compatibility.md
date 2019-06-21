---
title: IE兼容性问题以及解决方案
categories:
- practice
---

### 开始

虽然 San 支持 IE6，但是在实际开发过程中，多少会碰到一些兼容性问题。兼容性问题主要来源于老旧浏览器可能对如下特性不支持：

- 新的 JavaScript 语法特性
- 新的 JavaScript API 或 DOM API
- 新的 CSS 特性

对于应用开发而言，如果想要支持老旧的 IE 浏览器，建议遵循如下原则：

- 使用 ES5 或 ES3 语法进行开发
- 仅使用当前浏览器环境下支持的 API
- 使用老一些的模块管理方式，比如 AMD
- 仅使用当前浏览器环境支持的布局与样式定义
- 不使用较新的打包构建工具，或自己开发打包构建


但是，某些应用仅期望在老旧 IE 下基本可用，对性能等因素并没有严苛的要求，应用开发工程师期望使用现代的开发模式、语言特性、开发过程与开发工具。本文的下面部分，主要梳理了在这种情况下，可能遇到的 JavaScript 常见问题和解决办法。主要思路是：

- 通过实现不支持的 API 解决 API 差异性
- 通过编译解决旧环境不支持新语法


本文内容不涵盖 CSS 兼容性问题和解决方案。


### shim

一些 shim 库使用老旧浏览器下的 API，实现现代浏览器的 API，帮助开发者抹平浏览器环境的差异。下面推荐一些常用的。

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-sham.min.js"></script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js"></script>


<script src="https://wzrd.in/standalone/es7-shim@latest"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/json2/20160511/json2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
```

这些 shim 可以通过 IE 的条件注释，按需引入。

```html
<!--[if lt IE 9]>
  <script src="es5-shim/es5-shim.min.js"></script>
  <script src="es5-shim/es5-sham.min.js"></script>
  <script src="/json2/json2.min.js"></script>
<![endif]-->
```

想要更详细的了解条件注释，可以参考 [https://www.cnblogs.com/dtdxrk/archive/2012/03/06/2381868.html](https://www.cnblogs.com/dtdxrk/archive/2012/03/06/2381868.html)


### @babel/polyfill

**@babel/polyfill** 模拟了一个 ES6+ 的环境，让我们能够使用 ES6+ 的 APIs，我们在使用的时候要确保它在其他代码或者引用前被调用（比如可以在入口文件中直接引入）。

```
npm install --save @babel/polyfill
```

```javascript
// 引入方式1
require("@babel/polyfill");


// 引入方式2
import "@babel/polyfill";


// 引入方式3--在webpack的entry入口处添加
module.exports = {
  entry:['@babel/polyfill','src/index.js']
}
```

在实际应用场景下，整个 **@babel/polyfill** 体积较大。我们可以配置 **.babelrc** 来按需加载

```javascript
{
  "presets": [["@babel/preset-env", {
    "useBuiltIns": "usage", //如果我们配置了该项 就不需要在webpack中配置entry了
    "corejs": 3
  }]]
}
```


### es3ify-loader


老旧的 JavaScript 引擎在对象声明或属性访问表达式中，不支持保留字。


```javascript
// 提示 SCRIPTxxx: 缺少标识符
e.n = function (t) {
    var n = t && t.__esModule ? function () {
        return t.default
    } : function () {
        return t
    };
    return e.d(n, "a", n), n
}
```

使用 **es3ify-loader** 编译，可以解决这个问题。

```
npm intall --save-dev es3ify-loader post-loader
```

**es3ify-loader** 可以结合 **webpack** 使用。

```javascript
// webpack 配置 es3ify-loader
module: {
    rules: [{
            test: /.js$/,
            enforce: 'post', // post-loader处理
            loader: 'es3ify-loader'
        }
    ]
}
```

下面是 es3ify-loader 编译后的简单示例。

```javascript
// 编译前
function(t) { return t.default; }

// 编译后
function(t) { return t["default"]; }
```


### Object.defineProperty

如果使用了 `import & export`，**babel** 编译后会产生 `Object.defineProperty` 问题。

在IE8下，`Object.defineProperty` 只能对 DOM 对象使用，对原生对象使用 `Object.defineProperty` 会报错。下面提供一个方案，仅供参考

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

### querySelector and querySelectorAll

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

### Object.assign

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

### Webpack

IE9- 环境下，不支持 webpack4 打包代码中的 `getter/setter` 访问器属性。建议更换其他构建工具来进行打包构建。


### 最后 

要兼容老旧 IE 浏览器，问题还有很多。这里只是提供了一些解决办法，无法做到全部囊括。欢迎大家整理和贡献
