---
title: Object Traversal
categories:
- practice
---

San provides san-for directive (abbreviated as s-for) to render a list from Array data. Then how to traverse and render Object data? Since san does not provide directives for Object traversal, you can make use of the **computed property**.

#### Usage

```javascript
class MyComponent extends San.component {
    static computed = {
        list() {
            let myObject = this.data.get('myObject');
            return Object.keys(myObject).map(item => {
                return {
                    key: item,
                    value: myObject[item]
                }
            });
        }
    };
}
```

#### Demo

<p data-height="365" data-theme-id="dark" data-slug-hash="rzMZeN" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-traverse-object" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/rzMZeN/">san-traverse-object</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
