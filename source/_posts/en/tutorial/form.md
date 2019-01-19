---
title: Form
categories:
- tutorial
---


Forms are common user input hosting elements, and this section describes the usage of some common form elements. In MVVM, we typically apply **two-way binding** on form elements or components entered by the user.


Input
-----

The binding method of the input box is relatively simple, and it is sufficient to apply the two-way binding directly to the value attribute of the input box.


```html
<input type="text" value="{= name =}">
```


checkbox
-------

The common usage scenarios for checkboxes are grouping. In the component template, we bind the checked property to the component data of the same name in both directions.

`Hint`: Unless you need to make a traditional form submission, you don't need to specify the checkbox's name attribute. San only uses checked as the basis for grouping.

```html
<!-- Template -->
<div>
    <label><input type="checkbox" value="errorrik" checked="{= online =}">errorrik</label>
    <label><input type="checkbox" value="otakustay" checked="{= online =}">otakustay</label>
    <label><input type="checkbox" value="firede" checked="{= online =}">firede</label>
</div>
```

The data item we expect the checkbox to bind to is a **Array&lt;string&gt;** . When the checkbox is selected, its value is added to the bound data item; when the checkbox is unchecked, its value is removed from the bound data item.

```js
// Component
san.defineComponent({
    // ...

    initData: function () {
        return {
            online: []
        };
    },

    attached: function () {
        this.data.set('online', ['errorrik', 'otakustay']);
    }
});

```



radio
-----

Similar to the checkbox, in the component template, we bind the checked attribute to the component data of the same name in the radio that needs to be grouped.

`Hint`: You need to manually specify the name attribute of the group radio so that the browser can handle the mutual exclusion of the radio selection. It can be set to the same name as the bound data.

```html
<!-- Template -->
<div>
    <label><input type="radio" value="errorrik" checked="{= online =}" name="online">errorrik</label>
    <label><input type="radio" value="otakustay" checked="{= online =}" name="online">otakustay</label>
    <label><input type="radio" value="firede" checked="{= online =}" name="online">firede</label>
</div>
```

The data item we expect radio to bind to is a **string** . When radio is selected, the bound data item value is set to the value of the selected radio's value property.

```js
// Component
san.defineComponent({
    // ...

    initData: function () {
        return {
            online: 'errorrik'
        };
    }
});
```


select
------

The select is used in a similar way to the input box, applying a two-way binding directly to the value property.

```html
<!-- Template -->
<select value="{= online =}">
    <option value="errorrik">errorrik</option>
    <option value="otakustay">otakustay</option>
    <option value="firede">firede</option>
</select>
```

`Hint`: In the browser, the value attribute of select does not control its selected item, and the selected item of select is controlled by the selected attribute of option. Considering the ease of development, the developer does not need to write the selected property of option, and San will refresh the selected state of select in the next view update time slice.

```js
// Component
san.defineComponent({
    // ...

    initData: function () {
        return {
            online: 'errorrik'
        };
    }
});
```
