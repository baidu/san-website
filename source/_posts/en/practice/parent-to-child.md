---
title: How to Update Child Components?
categories:
- practice
---

#### props

Pass parent data to a child component with **props**, the child component will automatically get updated upon data changes.


```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's name: {{firstName}}</p>
        </div>
    `;
};

class Parent extends san.Component {
    static template = `
        <div>
             <input value="{= firstName =}" placeholder="please input">
             <ui-son firstName="{{firstName}}"/>
        </div>
    `;

    static components = {
        'ui-son': Son
    };

    initData() {
        return {
            firstName: 'trump'
        }
    }
};
```

<p data-height="365" data-theme-id="dark" data-slug-hash="qXPRxR" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-prop" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/qXPRxR/">san-parent-to-child-prop</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### ref

Actually the reference to the child component can be obtained by the `.ref()` method. Having this reference, we can call `ref.data.set()` or its member methods to update the child component's data.

```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's: {{firstName}}</p>
        </div>
    `;
};

class Parent extends san.Component {
    static template = `
        <div>
            <input value="{= firstName =}" placeholder="please input">
            <button on-click='onClick'>Pass to the Child</button>
            <ui-son san-ref="son"/>
        </div>
    `;
    static components = {
      'ui-son': Son
    };
    onClick() {
      this.ref('son').data.set('firstName', this.data.get('firstName'));
    }
}
```

<p data-height="365" data-theme-id="dark" data-slug-hash="wqrgGj" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-ref" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/wqrgGj/">san-parent-to-child-ref</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

#### message

Apart from the `.ref()` method, child component's reference can also be found in the event object which is dispatched from the child.

```javascript
class Son extends san.Component {
    static template = `
        <div>
            <p>Son's name: {{firstName}}</p>
            <button on-click='onClick'>I want a name</button>
        </div>
    `;

    onClick() {
        this.dispatch('son-clicked');
    }
};

class Parent extends san.Component {
    static template = `
        <div>
             <input value="{= firstName =}" placeholder="please input">
             <ui-son/>
        </div>
    `;

    // declare the expected message names
    static messages = {
        'son-clicked': function (arg) {
            let son = arg.target;
            let firstName = this.data.get('firstName');
            son.data.set('firstName', firstName);
        }
    };

    static components = {
        'ui-son': Son
    };

    initData() {
        return {
            firstName: 'trump'
        }
    }
};
```

<p data-height="365" data-theme-id="dark" data-slug-hash="ZJXLGZ" data-default-tab="js,result" data-user="asd123freedom" data-embed-version="2" data-pen-title="san-parent-to-child-prop" class="codepen">See the Pen <a href="https://codepen.io/asd123freedom/pen/ZJXLGZ/">san-parent-to-child-prop</a> by liuchaofan (<a href="https://codepen.io/asd123freedom">@asd123freedom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
