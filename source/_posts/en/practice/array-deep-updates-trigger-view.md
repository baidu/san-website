---
title: How does an array deep update trigger a view update?
categories:
- practice
---

In the San component, changes to the data need to be done by methods such as `set` or `splice`. San's implementation uses the easiest way to solve compatibility problems, and in order to ensure that the data manipulation process is controllable, San's data changes are internally Immutable. Therefore, when encountering an array deep data exchange, directly calling set to modify the data will find that the view does not trigger an update.

#### Scene description
```javascript
class MyApp extends san.Component {
    static template = `
        <div>
            <div 
                style="cursor: pointer"
                on-click="handlerClick($event)">Point me to exchange data</div>
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
        
        // want to exchange two values
        let firstNews = this.data.get('list');
        let firstData = firstNews[0];
        let secondData = firstNews[1];
        firstNews[1] = firstData;
        firstNews[0] = secondData;

        // The data set directly here does not trigger the update of the view.
        this.data.set('list', firstNews);
    }
}

let myApp = new MyApp();
myApp.attach(document.body);

```
#### Cause Analysis
The data of San's data is Immutable, so the reference to the variable does not change when set firstNews, and the diff is still equal and does not trigger an update.

#### Resolutions

<p 
    data-height="365" 
    data-theme-id="0" 
    data-slug-hash="eEyeYj" 
    data-default-tab="js,result" 
    data-user="sw811" 
    data-embed-version="2" 
    data-pen-title="Array deep update triggers view update" 
    class="codepen">See the Pen 
        <a href="https://codepen.io/sw811/pen/eEyeYj/">Array deep update triggers view update</a> 
        by solvan(<a href="https://codepen.io/sw811">@sw811</a>) on 
        <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

