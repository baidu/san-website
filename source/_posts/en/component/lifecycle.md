---
title: Component Lifecycle
categories:
- component
---

San components use HTML-based template syntax in order too keep their lifecycles consistent with WebComponents.

- `compiled` - Compiled the template of a component
- `inited` - Initialized a component instance with template and data
- `created` - Created a component element
- `attached` - Attached a component to DOM
- `detached` - Detached a component from DOM
- `disposed` - Destoryed a component instance

The lifecycle of a component has some of these features.

- The lifecycle represents the state of the component. The essence of the lifecycle is state management.
- At the different stages of the life cycle, the component will trigger the corresponding hook functions.
- States coexist such as `attached` and `created`.
- States are mutually exclusive such as `attached` and `detached` , `disposed` and others.
- Some time points do not represent the state of the component, only a certain behavior. The hook function is also triggered when the behavior is completed. For example, **updated** represents the completion of the view change caused by each data change.


Through the hook function of the life cycle, we can customize to do something in different lifecycles. For example, in the **attached** lifecycle initiate a request to get data, and then update the data to refresh the view.

```javascript
var ListComponent = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: []
        };
    },

    attached: function () {
        requestList().then(this.updateList.bind(this));
    },

    updateList: function (list) {
        this.data.set('list', list);
    }
});
```


The following diagram details the lifecycle of the component

<img src="../../../img/life-cycle.png" width="540">