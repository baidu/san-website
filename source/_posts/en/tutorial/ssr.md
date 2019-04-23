---
title: Server Side Rendering
categories:
- tutorial
---



San's server-side rendering is based on [component reversion](../reverse/).

- The HTML output from the server contains markups fragment that has no effect on the view and helps the component understand the structure of the data and view.
- On the browser side, the component structure is understood from the markup fragment when the component is initialized, and the component can respond correctly when the user operates.

`tips`: Since the component runtime environment needs to consider various browser version as well as NodeJS, the sample code is guaranteed to be simple and no transform is required, all written in ES5.

Do you need SSR?
----

We can gain some obvious benefits from server-side rendering which outputs HTML directly:

- SEO friendly, HTML direct output is more beneficial to search engine understanding and understanding
- Users can see the content the first time. In the developer's opinion, the first screen time is coming sooner.

However, if you use server-side rendering, we will face:

- Higher cost. Although we only need to develop one code of components, we need to consider its runtime is both NodeJS and browser; we need to consider rendering on the server side to compile in advance; we need to consider how the component's source code is output to the browser; we need to consider the browser compatibility of the component, whether to write old browser compatible code or write it by ESNext and then package the compile-time transform. These still bring about an increase in maintenance costs, even if not much.
- User interaction time does not necessarily arrive earlier. The interaction behavior is managed by the component.  Components need to traverse the DOM tree to reversing the data and structure from the current view.  The speed of component-reversion is not necessarily faster than the direct rendering at the front end.

Therefore, we recommend a comprehensive evaluation when using server-side rendering. Use SSR only in scenarios that must be used. Here are some scenario suggestions:

- Most of the backend systems (such as CMS、MIS、DashBoard) use the  Single Page Application mode. Obviously, these systems do not need to use SSR.
- Functional pages, such as personal center, my collection, etc, do not require SSR.
- Appear only in the App's WebView, not as an open web page, no need to use SSR.
- Focus on content pages, you can use SSR. But the component manages the behavioral interaction, and no component rendering is required for the content part. Only need to perform component de-rendering in the part with interaction.

Output HTML
----

```javascript
var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

var render = san.compileToRenderer(MyComponent);
render({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
});
// render html result:
// <a>....</a>
```


San provides the **compileToRenderer** method in the main package. This method takes the component's class as a parameter, then compiles, and returns a **{string}render({Object} data)** method. **render** method receives the data and returns rendered HTML string of the component.


Compile the NodeJS module
----

Sometimes, we want the render method compiled  by a component to be a separate NodeJS Module so that other modules can reference it. We can compile the NodeJS Module via the **compileToSource** method provided by the San main package.

```javascript
var san = require('san');
var fs = require('fs');

var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

var renderSource = san.compileToSource(MyComponent);
fs.writeFileSync('your-module.js', 'exports = module.exports = ' + renderSource, 'UTF-8');
```

The **compileToSource** method takes the component's class as a parameter, then compiles, and returns the source code of the component rendered. Specifically it is `function (data) {...}` string. We only need to add `exports = module.exports = ` to the front and write it to the **.js** file to get a NodeJS Module that conforms to the CommonJS standard.
