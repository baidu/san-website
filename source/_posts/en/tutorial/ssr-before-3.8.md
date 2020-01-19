---
title: Server Side Rendering (before 3.8.0)
categories:
- tutorial
---



San's server-side rendering is based on [component reversion](../reverse/).

- The HTML output from the server contains markup fragments which takes no effect on the view but helps components understand the structure of the data and view.
- On the browser side, the component structure is understood from the markup fragments when a component is initialized, and the component can respond correctly when the user interacts with it.

**tips**: Since component runtime environment is required to take care of various browser versions as well as NodeJS, the sample code is guaranteed to be simple and no transform is required, all written in ES5.

Do you need SSR?
----

We can gain some obvious benefits from server-side rendering by responding HTML directly:

- SEO friendly, HTML direct output is more beneficial to search engine understanding and understanding
- Users can see the content the first time. In the developer's opinion, the first screen time is coming sooner.

When utilizing server-side rendering, however, we will also encounter some shortcomes:

- Higher mental overhead. Although we only need to write once for components, we have to keep both NodeJS and browser environment in mind; we need to consider rendering on the server side to compile in advance; we need to consider how the component's source code is output to the browser; we need to consider the browser compatibility, whether to write old browser compatible code or to implement via ESNext and use tools like babel to transform it. All these staffs bring cost - even trivial - to developers.
- The first interactive time does not necessarily arrive earlier. The interaction behavior is managed by the component.  Components need to traverse the DOM tree to reversing the data and structure from the current view. The performance of component-reversion is not necessarily faster than the direct rendering in front end.

Therefore, we recommend a comprehensive evaluation when using server-side rendering. Use SSR only in scenarios that benefits. Some suggestions are:

- Most of the backend systems (such as CMS、MIS、DashBoard) use a Single-Page-Application mode. Obviously, these systems do not need to use SSR.
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


San provides a `compileToRenderer` function in its main package. This function takes the component's class as a parameter, compiles it and returns a `{string} render({Object} data)` method. `render` method receives the data and returns rendered HTML string of the component.


Compile the NodeJS module
----

Sometimes, we want the render function compiled by a component to be a separate NodeJS Module so that other modules can reference it. We can compile the NodeJS module via the `compileToSource` function provided by San main package.

```javascript
var san = require('san');
var fs = require('fs');

var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

var renderSource = san.compileToSource(MyComponent);
fs.writeFileSync('your-module.js', 'exports = module.exports = ' + renderSource, 'UTF-8');
```

The `compileToSource` function takes the component's class as a parameter, then compiles, and returns the source code of the component rendered. Specifically it is `function (data) {...}` string. We only need to add `exports = module.exports = ` to the front and write it to the `.js` file to get a NodeJS Module that conforms to the CommonJS standard.
