---
title: Data Validation
categories:
- tutorial
---

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

**Considering performance, `dataTypes` only get evaluated in `development` environment.**

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
