---
title: can use operate dom?
categories:
- practice
---

When we were using San, especially the newcomers who just used it, and the experience of the MVVM framework is not so rich, are still more accustomed to using jQuery as a class library to manipulate the interaction of the page, so it is natural to write such code.

```
var MyApp = san.defineComponent({
    template: '<input value="noClick" class="ipt"/><button class="btn"></button>',
    attached: function () {
        this.bindSomeEvents();
    },
    bindSomeEvents: function () {
        $('.btn').click(()=>{
            $('.ipt').val('clicked');
        });
    }
});
var myApp = new MyApp();
myApp.attach(document.querySelector('#app'));
```

Then run this program in the browser, the results are completely in line with expectations, perfect.

However, as we become more familiar with the way San is used, we will write such code for the above functions.

```
var MyApp = san.defineComponent({
    template: '<div><input value="{{value}}"/><button on-click="clickHandler">click me</button></div>',
    initData: function () {
        return {
            value: 'no click'
        };
    },
    clickHandler: function () {
        this.data.set('value', 'clicked')
    }
});
var myApp = new MyApp();
myApp.attach(document.querySelector('#app'));
```

Careful scrutiny of the two pieces of code, can not help but raise a question.

Intuitively, in San's code, we directly call this.data.set to modify the value of an attribute. It automatically renders the modified content to the DOM. It seems to be very magical, but it is still fundamentally the operation of the DOM. This operation is done by the San framework. Since this is the case, why can't we directly modify it directly like the first piece of code, and do these operations to San to complete? If you give it to San for performance reasons, it needs to complete the relationship binding from Model to view. It also needs some performance loss, so it seems to be quite costly. So why do we still have to do this?

Follow this question, we can consider these aspects.

### What was the original intention of using San?

San is a component framework of MVVM (Model-View-ViewModel). With the MVVM framework, we only need to complete the view template containing the **declaration binding**, write the business data change logic in the ViewModel, and the View layer is fully automated. This will greatly reduce the operational complexity of the front-end application and greatly improve the development efficiency of the application. The most iconic feature of MVVM is **data binding**. The core idea of MVVM is to realize the separation of View layer and other layers through **declarative data binding**, completely decoupling the concept of View layer. It also makes it easier to write unit test cases for the web front end.

To put it simply: the operational data is the operational view, which is the operation of the DOM.

### This DOM is not a DOM

The template attribute in the code we wrote, called the **content template** in San, is a string that conforms to the HTML syntax rules, which is parsed by San, returning an [ANode] (https:// Github.com/baidu/san/blob/master/doc/anode.md) Object.

That is to say, what we write in the template is not actually placed on the DOM. It is used by San. The actual generated DOM is actually San. According to the parsing result of your template, it is [ANode] (https ://github.com/baidu/san/blob/master/doc/anode.md) Build, there is actually a layer of San between your code and the DOM.

If we directly use the native api or jQuery to directly manipulate the San generated DOM, this is unreasonable, because those DOM are not written by us at all, but we have to try to modify it, obviously we should not do so.

Not directly operating DOM This is actually in line with the basic principles of hierarchical architecture design in the computer field. Each layer performs independent functions, and then the upper layer uses the underlying api to call the exposed functions of the underlying layer, but prohibits cross-layer calls.

### Sometimes we overestimate the problem of performance

The San framework greatly improves the development efficiency of the application. It helps us to shield the cumbersome DOM operations and helps us deal with the relationship between Model and View. This looks really good, but all the good things always cost a lot. If San does this, it will bring performance overhead, so it is worse than using DOM directly. It is undoubted that the world is not likely to have better performance than direct DOM. If you want to change the display state of a page, DOM is its only API, and no framework can be bypassed.

But is this performance consumption really bringing unmaintainable problems to my application? But most of the reason is because the code structure in development is unreasonable, the code is not standardized, the function division is not clear enough, etc. Projects caused by a series of subjective problems cannot be maintained.
### Conclusion

In our project, choose San as the framework, which not only frees you from the cumbersome DOM operation, but also greatly reduces the operational complexity of the front-end application and greatly improves the development efficiency of the application. As a separate data, logic, and view encapsulation unit, the component system can help you sort out the application code structure in development and ensure that the system can be more easily maintained.


