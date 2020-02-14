---
title: What Content is Not Suitable for the Data?
categories:
- practice
---

As introduced before, the contents of data are expected to be view related. In this article we give a list of inproppriate uses of the data.

#### Functions

Functions are not suitable to be stored in the data. Functions are expected to be separated from the data, and can be imported from other source files or implemented as component methods.

```javascript
// bad
this.data.set('camel2kebab', function (source) {
    return source.replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    });
});
```

#### DOM Objects

```javascript
// bad
this.data.set('sideEl', document.querySelector('sidebar'));
```

#### Complex Objects

Complex objects like components are not suitable to be stored in the data.
For example, using data to store dynamic child components is not recommended, use member properties instead.

```javascript
// bad
var layer = new Layer();
layer.attach(document.body);
this.data.set('layer', layer);

// good
var layer = new Layer();
layer.attach(document.body);
this.layer = layer;
```
