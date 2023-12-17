---
title: Data Manipulation
categories:
- tutorial
---


San provides a number of methods on components' data. You can retrieve data via `.get()` method and modify data via `.set()`, `.splice()` methods, views will be updated automatically.

`Note`: You may ask why do we have to use these methods instead of manipulating data directly? That's because the [defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) API is still not fully supported by major browsers in China and we prefer non-invasive ways to implement data binding. As a result, you have to use the methods provided by San in order to get the views updated automatically.

Initialization
-----

By defining an `initData` method, you can specify the data used to initialize the component. The return value of `initData` method will be used as the initialization data.

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


`Explanation`:

Use `.get()` method to retrieve data.

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

The entire data object will be returned if the `expr` argument is not provided. The no argument function overload is provided for ESNext destructuring to retrieve multiple data items with a single expression.

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

`Note`: The data retrieved via **get** method is not expected to be modified, which will lead to inconsistent state. Use the following **set**, **splice** methods to modify any data.


set
-----

```
set({string|Object}expr, {*}value, {Object?}option)
```


`Explanation`:

The `.set()` method should be used in most cases, which is equivalent to the JavaScript assignment operator (=).


`Usage`:

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

`Version`: >= 3.9.0

`Explanation`:

`assign` method merges `source` object into component's data, which is similar to `Object.assign` in JavaScript, this makes a batch update to view.

`Usage`:

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

`Version`: >= 3.4.0

`Explanation`:

The `.merge()` method merges `source` into the data item specified by `expr`.

`Usage`:


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

`Version`: >= 3.4.0

`Explanation`:

`.apply()` method accepts a function argument, which takes the data's current value as its input, and returns the updated value. The behavior of `.apply()` is like the JavaScript `Array.prototype.map` method.


`Usage`:

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

Array Methods
------

We provide a number of methods for array manipulation. All of them take the same name as the `Array.prototype` except **remove**. Hope it helps to memorize!

`Note`: Use `.set()` method to modify an Array element. Actually whenever you want a JavaScript `=` assignment, you'll need the `.set()` method.

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

`Explanation`:

Append an element into an array.

`Usage`:


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

`Explanation`:

Pop one element out of an array.

`Usage`:

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

`Explanation`:

Insert one element to the beginning of an array.

`Usage`:

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

`Explanation`:

Remove one element from the beginning of an array.

`Usage`:

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

`Explanation`:

Remove the given item.

`.remove()` compares `item` to elements of the Array using [strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Using_the_Equality_Operators) (the same method used by the `===` operator).

`Usage`:

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

`Explanation`:

Remove the element at the given index.

`Usage`:

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

`Explanation`:

The `.splice()` method changes the contents of an array by removing existing elements and/or adding new elements.

`Usage`:

```javascript
san.defineComponent({
    rm: function (index, deleteCount) {
        this.data.splice('users', [index, deleteCount]);
    }
});
```

option
------

Each of the above methods accepts an extra `option` argument, which is a plain object of key-value pairs to control how the views will be updated.


### silent

`Explanation`:

Update the data silently without updating the view.


### force

`Version`: >= 3.5.5

`Explanation`:

Force update the view even if the data to be set is identical to the existing value. Available for `.set()` method only.


Data Validation
------

Validation rules can be specified for component data. san will throw the corresponding error when validation fails. It's rather useful in collaboration.

Use `DataTypes` to declare validation rules:

```js
import san, {DataTypes} from 'san';

let MyComponent = san.defineComponent({

    dataTypes: {
        name: DataTypes.string
    }

});
```

`DataTypes` provides a series of validators to ensure the data received is valid. In the above example, a `DataTypes.string` validator is used so that san will throw an error when the value for `name` is not a `String`.

**For performance considerations, `dataTypes` only get evaluated in `development` environment.**

Please refer to this [link](https://github.com/baidu/san/tree/master/dist) to check out their availabilities in different san releases.

## DataTypes

Following is a demo for a variety of `DataTypes` validators:

```js
import san, {DataTypes} from 'san';

san.defineComponent({

    // specified as JavaScript primitive types
    // these fields are optional by default
    optionalArray: DataTypes.array,
    optionalBool: DataTypes.bool,
    optionalFunc: DataTypes.func,
    optionalNumber: DataTypes.number,
    optionalObject: DataTypes.object,
    optionalString: DataTypes.string,
    optionalSymbol: DataTypes.symbol,

    // specified as instances of some class
    // it's implemented by `instanceof`
    optionalMessage: DataTypes.instanceOf(Message),

    // if values are from a fixed set, declare it as an enum type
    optionalEnum: DataTypes.oneOf(['News', 'Photos']),

    // can be specified as one of many types
    optionalUnion: DataTypes.oneOfType([
        DataTypes.string,
        DataTypes.number,
        DataTypes.instanceOf(Message)
    ]),

    // each item of the Array must be of the specified type
    optionalArrayOf: DataTypes.arrayOf(DataTypes.number),

    // each property of the Object must have a value of the specified type
    optionalObjectOf: DataTypes.objectOf(DataTypes.number),

    // objects with a specified structure
    optionalObjectWithShape: DataTypes.shape({
        color: DataTypes.string,
        fontSize: DataTypes.number
    }),

    // every validator above provides a `isRequired` method to specify the field as required
    requiredFunc: DataTypes.func.isRequired,
    requiredObject: DataTypes.shape({
        color: DataTypes.string
    }).isRequired,

    // a required field of any type
    requiredAny: DataTypes.any.isRequired,

    // custom validators can be defined, simply throw an error to indicate a validation failure
    customProp: function (props, propName, componentName) {
        if (!/matchme/.test(props[propName])) {
            throw new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    },

    // Validators for `arrayOf` and `objectOf` can be defined.
    // Throw an error if validation fails.
    // Every item of the Array (or Object) will be validated against the custom validator.
    // The first argument is the Array (or Object),
    // The second argument is the index (or property name) of the item (or property) to be validated.
    customArrayProp: DataTypes.arrayOf(function (dataValue, key, componentName, dataFullName) {
        if (!/matchme/.test(dataValue[key])) {
            throw new Error(
                'Invalid prop `' + dataFullName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    })

});
```