---
title: Error Capture
categories:
- component
---

`Version`：>= 3.10.7

The [error hook](../../doc/api/#error) called when an error from any descendent component is captured. The hook receives three arguments: the error, the component instance that triggered the error, and a string containing information on where the error was captured.

```javascript
var Child = san.defineComponent({
    template: '<h1>test</h1>',
    attached: function () {
        throw new Error('error');
    }
});
var myApp = san.defineComponent({
    template: '<div><x-child /></div>',
    components: {
        'x-child': Child
    },
    error: function (err, instance, info) {
        // some code
    }
});
myApp.attach(myApp);
```

The error informance `info` includes:
- `hook:{{ hookName }}`: Captured in lifecycle hooks.
- `initData`: Captured in initData function.
- `computed:{{ computedName }}`: Captured in computed functions.
- `watch:{{ watchName }}`: Captured in data watch handlers.
- `message:{{ messageName }}`: Captured in message handlers.
- `filter:{{ filterName }}`: Captured in filers.
- `event:{{ eventName }}`: Captured in event handlers.
- `transitionCreate`: Captured in [Animation Controller Creator](../../tutorial/transition/#Animation-Controller-Creator).
- `transitionEnter`: Captured in Enter [Animation Controller](../../tutorial/transition/#Animation-Controller).
- `transitionLeave`: Captured in Leave [Animation Controller](../../tutorial/transition/#Animation-Controller).
