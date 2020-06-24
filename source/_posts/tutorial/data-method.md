---
title: 数据操作
categories:
- tutorial
---


San 在组件的 data 上提供了一些数据操作的方法。通过 get 方法可以获取数据；通过 set、splice 等方法修改数据，相应的视图会被自动刷新。

`说明`：为什么是通过 San 提供的方法操作数据，而不是直接操作数据？因为defineProperty并未被国内常用的浏览器广泛支持，并且我们也并不喜欢这种侵入式的风格，所以我们选择了折中的方式。因此，只有通过 San 提供的方法修改数据，视图才会自动刷新。

初始化
-----

通过定义 initData 方法，可以在定义组件时指定组件初始化时的数据。initData 方法返回组件实例的初始化数据。

```javascript
san.defineComponent({
    initData: function () {
        return {
            width: 200,
            top: 100,
            left: -1000
        };
    }
});
```

get
-----

```
{*} get({string|Object?}expr)
```


`解释`：

get 方法能够让我们从 data 中获取数据。

```javascript
san.defineComponent({
    initData: function () {
        return {
            width: 200,
            top: 100,
            left: -1000
        };
    },

    attached: function () {
        this.data.get('width'); // 200
    }
});
```

当 expr 参数为空时，将返回整个数据项的对象。提供无参的 **get** 方法，主要是为了 ESNext 的解构，能够在一个表达式中获取多个数据项。

```javascript
san.defineComponent({
    initData: function () {
        return {
            width: 200,
            top: 100,
            left: -1000
        };
    },

    attached: function () {
        this.data.get().width; // 200

        // top: 100
        // left: -1000
        let {top, left} = this.data.get();
    }
});
```

`注意`： **get** 方法获取的数据不能直接修改，否则可能导致不一致的问题。数据修改请使用本文下面的 **set** 、 **splice** 等方法


set
-----

```
set({string|Object}expr, {*}value, {Object?}option)
```


`解释`：

set 方法是最常用的数据修改方法，作用相当于 JavaScript 中的赋值 (=)。


`用法`：

```javascript
san.defineComponent({
    attached: function () {
        requestUser().then(this.userReceived.bind(this));
    },

    userReceived: function (data) {
        this.data.set('user', data);
    },

    changeEmail: function (email) {
        this.data.set('user.email', email);
    }
});
```

assign
-----

```
assign({Object}source, {Object?}option)
```

`版本`：>= 3.9.0

`解释`：

assign 方法将传入数据对象（source）与 data 合并，进行批量更新。作用类似于 JavaScript 中的 `Object.assign`。


`用法`：


```javascript
san.defineComponent({
    initData: function () {
        return {
            title: 'ER',
            type: 'MVC',
            author: 'Someone'
        };
    },

    attached: function () {
        this.data.assign({
            title: 'San',
            type: 'MVVM'
        });
    }
});
```

merge
-----

```
merge({string|Object}expr, {Object}source, {Object?}option)
```

`版本`：>= 3.4.0

`解释`：

merge 方法对指定的数据项，使用传入数据对象（source）进行合并。

`用法`：


```javascript
san.defineComponent({
    attached: function () {
        requestUser().then(this.updateUserInfo.bind(this));
    },

    updateUserInfo: function (data) {
        this.data.merge('user', data);
    }
});
```

apply
-----

```
apply({string|Object}expr, {function({*}):{*}}value, {Object?}option)
```

`版本`：>= 3.4.0

`解释`：

apply 方法接受一个函数作为参数，传入当前的值到函数，然后用新返回的值更新它。其行为类似 `Array.prototype.map` 方法。


`用法`：

```javascript
san.defineComponent({
    initData: function () {
        return {
            number: 1,
        }
    },

    attached: function () {
        // increment
        this.data.apply('number', function (n) {
            return n + 1;
        });
    }
});
```

数组方法
------

我们提供了一些数组操作的方法，这些方法与 JavaScript 的数组操作方法基本同名，以减少使用者的学习与记忆成本。除了 **删除** 操作。

`提示`：修改数组项还是直接使用 set 方法。我们可以认为，基本上所有写 JavaScript 时使用 = 赋值的场景，都用 set 方法。

```javascript
san.defineComponent({
    flag: function () {
        this.data.set('users[0].flag', true);
    }
});
```


### push


```
{number} push({string|Object}expr, {*}value, {Object?}option)
```

`解释`：

在数组末尾插入一条数据。

`用法`：


```javascript
san.defineComponent({
    addUser: function (name) {
        this.data.push('users', {name: name});
    }
});
```

### pop

```
{*} pop({string|Object}expr, {Object?}option)
```

`解释`：

在数组末尾弹出一条数据。

`用法`：

```javascript
san.defineComponent({
    rmLast: function () {
        this.data.pop('users');
    }
});
```


### unshift

```
{number} unshift({string|Object}expr, {*}value, {Object?}option)
```

`解释`：

在数组开始插入一条数据。

`用法`：

```javascript
san.defineComponent({
    addUser: function (name) {
        this.data.unshift('users', {name: name});
    }
});
```

### shift

```
{*} shift({string|Object}expr, {Object?}option)
```

`解释`：

在数组开始弹出一条数据。

`用法`：

```javascript
san.defineComponent({
    rmFirst: function () {
        this.data.shift('users');
    }
});
```

### remove

```
remove({string|Object}expr, {*}item, {Object?}option)
```

`解释`：

移除一条数据。只有当数组项与传入项完全相等(===)时，数组项才会被移除。

`用法`：

```javascript
san.defineComponent({
    rm: function (user) {
        this.data.remove('users', user);
    }
});
```

### removeAt

```
removeAt({string|Object}expr, {number}index, {Object?}option)
```

`解释`：

通过数据项的索引移除一条数据。

`用法`：

```javascript
san.defineComponent({
    rmAt: function (index) {
        this.data.removeAt('users', index);
    }
});
```

### splice

```
{Array} splice({string|Object}expr, {Array}spliceArgs, {Object?}option)
```

`解释`：

向数组中添加或删除项目。

`用法`：

```javascript
san.defineComponent({
    rm: function (index, deleteCount) {
        this.data.splice('users', [index, deleteCount]);
    }
});
```

option
------

每个数据操作方法，最后都可以包含一个类型为 Object 的数据操作选项参数对象，该对象中的参数可控制视图更新行为。


### silent

`解释`：

静默更新数据，不触发视图变更。


### force

`版本`：>= 3.5.5

`解释`：

设置相同的数据时，强制触发视图变更。该参数仅对 set 方法有效


