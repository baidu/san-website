---
title: Component Data
categories:
- component
---

All component data related operations are provided by the **data** property of the component instance.

## Retrieving Data

Retrieve data through the **data.get** method.

```javascript
san.defineComponent({
    attached: function () {
        var params = this.data.get('params');
        this.data.set('list', getList(params[1]));
    }
});
```

The **data.get**  method accepts a string representing the `property accessor`, so the above example can also be written like this:

```javascript
san.defineComponent({
    attached: function () {
        var param = this.data.get('params[1]');
        this.data.set('list', getList(param));
    }
});
```

## Manipulating Data

**data** provides some methods of data manipulation. Refer to the [data manipulation](../../tutorial/data-method/) document for more.


## Initializing Data

When the component is instantiated, you can pass the **data** option to specify the component's initial data.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>'
});

var myApp = new MyApp({
    data: {
        list: ['san', 'er', 'esui', 'etpl', 'esl']
    }
});
myApp.attach(document.body);
```

Passing in the initial data when `new` a component is not a common parttern. In general, If you want to set initial data for each instance when you define a component, you can specify it in the **initData** method. The **initData** method returns initial data for the component instance.

```javascript
var MyApp = san.defineComponent({
    template: '<ul><li s-for="item in list">{{item}}</li></ul>',

    initData: function () {
        return {
            list: ['san', 'er', 'esui', 'etpl', 'esl']
        };
    }
});

var myApp = new MyApp();
myApp.attach(document.body);
```

## Computed Data

Sometimes, the value of a data item may be computed from other data items, and we can define  **computed** to compute data. **computed** is an object, the key is the name of the computed data item, and value is a function that returns the value of the data item.

```javascript
san.defineComponent({
    template: '<a>{{name}}</a>',

    // name 数据项由 firstName 和 lastName 计算得来
    computed: {
        name: function () {
            return this.data.get('firstName') + ' ' + this.data.get('lastName');
        }
    }
});
```

In this case, item  `name` is a computed data, whose value computed from `firstName` and `lastName` data item.

`tips`: In functions of computing data, you can only use the *this.data.get* method to get the values of data items. You cannot call a component method with this.method or set the component data with this.data.set.

```javascript
san.defineComponent({
    template: '<a>{{info}}</a>',

    // name 数据项由 firstName 和 lastName 计算得来
    computed: {
        name: function () {
            return this.data.get('firstName') + ' ' + this.data.get('lastName');
        },

        info: function () {
            return this.data.get('name') + ' - ' + this.data.get('email');
        }
    }
});
```

The computed data item can depend on another computed data item. In the above example, the `name` item that the `info` item depends on is a computed data item. However, be careful when using it, do not form a circular dependency between the computed data items.