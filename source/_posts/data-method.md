---
title: 数据操作
categories:
- tutorial
---


San 在组件的 data 上提供了一些数据操作的方法。通过这些方法操作数据，相应的视图会被自动刷新。

`说明`：为什么是通过 San 提供的方法操作数据，而不是直接操作数据？因为defineSetter并未被国内常用的浏览器广泛支持，所以我们选择了折中的方式。因此，只有通过 San 提供的方法修改数据，视图才会自动刷新。

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


set
-----

set 方法是最常用的操作数据的方法，作用相当于 JavaScript 中的赋值 (=)。

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

在数组末尾插入一条数据。

```javascript
san.defineComponent({
    addUser: function (name) {
        this.data.push('users', {name: name});
    }
});
```

### pop

在数组末尾弹出一条数据。

```javascript
san.defineComponent({
    rmLast: function () {
        this.data.pop('users');
    }
});
```


### unshift

在数组开始插入一条数据。

```javascript
san.defineComponent({
    addUser: function (name) {
        this.data.unshift('users', {name: name});
    }
});
```

### shift

在数组开始弹出一条数据。

```javascript
san.defineComponent({
    rmFirst: function () {
        this.data.shift('users');
    }
});
```

### remove

移除一条数据。只有当数组项与传入项完全相等(===)时，数组项才会被移除。

```javascript
san.defineComponent({
    rm: function (user) {
        this.data.remove('users', user);
    }
});
```

### removeAt

通过数据项的索引移除一条数据。

```javascript
san.defineComponent({
    rmAt: function (index) {
        this.data.removeAt('users', index);
    }
});
```






