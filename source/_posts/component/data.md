---
title: 组件数据
categories:
- component
---

组件数据的获取和修改，由组件实例的 **data** 成员提供。

`新增`：在 >= 3.15.0 中，支持通过 **d** 对组件数据进行获取和修改。


## 获取数据

通过 **data.get** 方法可以获取数据。在 >= 3.15.0 中，支持通过 **d** 获取数据

```javascript
san.defineComponent({
    attached: function () {
        var params = this.data.get('params');
        var params = this.d.params;  // >= 3.15.0
    }
});
```

**data.get** 方法接受一个表示 property accessor 的字符串：

```javascript
san.defineComponent({
    attached: function () {
        var param = this.data.get('params[1]');
        var param = this.d.params[1];  // >= 3.15.0
    }
});
```

## 修改数据

**data** 上提供了一些数据操作的方法，用于修改数据。具体请参考[数据操作](../../tutorial/data-method/)文档。


## 初始数据

组件在实例化时可以通过 option 传入 **data**，指定组件初始化时的数据。

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

new 时传入初始数据是针对实例的特例需求。当我们希望在定义组件时，就设置每个实例的初始数据，可以通过 **initData** 方法指定组件初始化时的数据。**initData** 方法返回组件实例的初始化数据。

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

## 计算数据

有时候，一个数据项的值可能由其他数据项计算得来，这时我们可以通过 **computed** 定义计算数据。 **computed** 是一个对象，key 为计算数据项的名称，value 是返回数据项值的函数。

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

上面的例子中，name 数据项是计算数据，依赖 firstName 和 lastName 数据项，其值由 firstName 和 lastName 计算得来。

`注意`：计算数据的函数中只能使用 *this.data.get* 方法获取数据项的值，不能通过 this.method 调用组件方法，也不能通过 this.data.set 设置组件数据。

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

计算数据项可以依赖另外一个计算数据项，上面的例子中，info 项依赖的 name 项就是一个计算数据项。但是使用时一定要注意，不要形成计算数据项之间的循环依赖。

`新增`：在 >= 3.15.0 中，computed 可以使用 **d** 获取组件数据。

```javascript
san.defineComponent({
    template: '<a>{{info}}</a>',

    // name 数据项由 firstName 和 lastName 计算得来
    computed: {
        name: function () {
            return this.d.firstName + ' ' + this.d.lastName;
        },

        info: function () {
            return this.d.name + ' - ' + this.d.email;
        }
    }
});
```
