---
title: 数组深层更新如何触发视图更新？
categories:
- practice
---

在 San 组件中，对数据的变更需要通过`set` 或 `splice` 等方法，实现用最简单的方式，解决兼容性的问题，同时为了保证数据操作的过程可控，San 的数据变更在内部是 Immutable 的，因此遇到数组深层做数据交换时直接 set 数据会发现没有触发视图的更新



#### 场景描述
```javascript
class MyApp extends san.Component {
    static template = `
        <div>
            <div 
                style="cursor: pointer"
                on-click="handlerClick($event)">点我交换数据</div>
            <ul>
                <li s-for="item in list">{{item.title}}</li>
            </ul>
        </div>
    `;
    initData() {
        return {
            list: [
                {
                    title: 'test1'
                },
                {
                    title: 'test2'
                }

            ]
        };
    }
    handlerClick() {
        
        // 想交换两个值
        let firstNews = this.data.get('list');
        let firstData = firstNews[0];
        let secondData = firstNews[1];
        firstNews[1] = firstData;
        firstNews[0] = secondData;

        // 在这里直接set数据发现并没有触发视图的更新
        this.data.set('list', firstNews);
    }
}

let myApp = new MyApp();
myApp.attach(document.body);

```
#### 原因分析
San 的数据是 Immutable 的，因此 set firstNews 时变量的引用没变， diff 的时候还是相等的，不会触发更新。

#### 解决方式如下

<p 
    data-height="365" 
    data-theme-id="0" 
    data-slug-hash="eEyeYj" 
    data-default-tab="js,result" 
    data-user="sw811" 
    data-embed-version="2" 
    data-pen-title="数组深层更新触发视图更新" 
    class="codepen">See the Pen 
        <a href="https://codepen.io/sw811/pen/eEyeYj/">数组深层更新触发视图更新</a> 
        by solvan(<a href="https://codepen.io/sw811">@sw811</a>) on 
        <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

