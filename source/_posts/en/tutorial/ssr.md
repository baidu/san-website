---
title: Server Side Rendering
categories:
- tutorial
---

> From 3.8.0, server side rendering for san is provided by [san-ssr][san-ssr]. If you're using san@<3.8.0, please refer to [Server Side Rendering (before 3.8.0)](../ssr-before-3.8/).

San's server-side rendering is based on [component hydrate](../../component/hydrate/).

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
const { defineComponent } = require('san');
const { compileToRenderer } = require('san-ssr');
const MyComponent = defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});
const render = compileToRenderer(MyComponent);

console.log(render({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
}));
// Outputs:
// <a><!--s-data:{"email":"errorrik@gmail.com","name":"errorrik"}--><span title="errorrik@gmail.com">errorrik</span></a>
```

san-ssr provides a **compileToRenderer** function, which takes the component class as the parameter and returns a **{string}render({Object} data)** method, which takes a data object and returns the rendered HTML string.


Output CommonJS Module
----

In some cases, we need the render method to be a standalone CommonJS Module which can be required and called by other modules. san-ssr provides a **compileToSource** function for this:

```javascript
const { defineComponent } = require('san');
const { compileToSource } = require('san-ssr');
const { writeFileSync } = require('fs');
const MyComponent = defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});
const fnBody = compileToSource(MyComponent);
writeFileSync('ssr.js', 'exports = module.exports = ' + fnBody);
```

**compileToSource** takes the component class as input, and returns the function body of the renderer for this component class, which looks like `function (data) {...}`. You'll need to add a `exports = module.exports = ` prefix before it's written into a .js file. This way you'll get a CommonJS module.


From File To File
----

You'll need more capability from san-ssr when it comes to writting build tools. For instance, take a file as input and output a file, support TypeScript files, etc. The following is a demo for taking TypeScript file as input and output a CommonJS file:

The component source code (a San component named `NameComponent`):

```typescript
import { Component } from 'san'

export default class NameComponent extends Component {
    public static template = '<a><span title="{{email}}">{{name}}</span></a>'
}
```

Compile the component class into a CommonJS module containing the renderer:

```typescript
import { SanProject } from 'san-ssr'
import { writeFileSync } from 'fs'

const project = new SanProject()
const targetCode = project.compile('./name.comp.ts')

writeFileSync('name.ssr.js', targetCode)
```

Use `name.ssr.js` as a CommonJS module:

```typescript
import nameRenderer = require('./name.ssr')

console.log(nameRenderer({
    email: 'errorrik@gmail.com',
    name: 'errorrik'
}))
// Outputs:
// <a><!--s-data:{"email":"errorrik@gmail.com","name":"errorrik"}--><span title="errorrik@gmail.com">errorrik</span></a>
```

Commandline Interface
----

san-ssr can also be used as a CLI tool. Install locally for npm scripts usage, or install globally:

```bash
npm install -g san-ssr
```

Compile the `NameComponent` component class mentioned above:

```bash
san-ssr ./name.comp.ts > name.ssr.js
```

For more tutorials and API regarding to SSR, please refer to:

* README：https://github.com/baidu/san-ssr
* TypeDoc: https://baidu.github.com/san-ssr

[san-ssr]: https://github.com/baidu/san-ssr

