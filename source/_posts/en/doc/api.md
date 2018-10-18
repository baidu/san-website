---
title: Component API
categories:
- doc
---

This document describes components API, the San module API
please refer to [San API](../../doc/main-members/).


Initialization Arguments
-------

### data

`Explanation`：

Initialization Data. Can be used for [component reverse](../../tutorial/reverse/).


`Type`： Object


`Usage`：

```javascript
var MyComponent = san.defineComponent({});

var myComponent = new MyComponent({
    el: document.getElementById('my-label'),
    data: {
        email: 'errorrik@gmail.com',
        name: 'errorrik'
    }
});

/* html:
<label id="my-label">
    <span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span>
</label>
```