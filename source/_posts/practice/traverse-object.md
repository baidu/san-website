---
title: 如何遍历一个对象？
categories:
- practice
---

在San中已经提供了 san-for 指令（可以简写为 s-for ）将 Array 渲染为页面中的列表，那么对于 Object 想要进行遍历并渲染应当怎么做呢？由于 San 的指令并不直接支持 Object 的遍历，因此可以使用计算属性进行对象的遍历

#### 使用

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

#### 示例

<p data-height="365" data-theme-id="dark" data-slug-hash="rzMZeN" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-traverse-object" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/rzMZeN/">san-traverse-object</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
