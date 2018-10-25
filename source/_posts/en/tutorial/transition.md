---
title: Transitions
categories:
- tutorial
---

In order to deliver better user experience, it's common to introduce transitions during view components insertion or removal.
San provides basic transition mechanism to facilitate the development of experience-rich web apps.

`version`: >= 3.3.0


s-transition
-----

Transition controllers can be specified on elements using **s-transition** directives.

```html
<button s-transition="opacityTransition">click</button>
```

The directive value is the corresponding property name of the element's owner component.

```javascript
san.defineComponent({
    template: '<div><button s-transition="opacityTransition">click</button></div>',

    opacityTransition: {
        // The controller structure will be described in the following sections.
        // ...
    }
});
```

**s-transition** directives are typically used with **if** or **for** directives.

```html
<button s-transition="opacityTransition" s-if="allowEdit">Edit</button>
<b s-transition="opacityTransition" s-else>Edit not allow</b>
```


The transition controller specified by **s-transition** directive can be a deep property of the owner component.

```javascript
san.defineComponent({
    template: '<div><button s-transition="trans.opacity">click</button></div>',

    trans: {
        opacity: {
            // The controller structure will be described in the following sections.
            // ...
        }
    }
});
```

`Note`: **s-transition** can be used on concrete elements only. If used on virtual elements, like **template**, **s-transition** will have no effect.


Animation Controller
------

Animation controllers are objects that have **enter** and **leave** methods.

The signature for both **enter** and **leave** methods are: **function({HTMLElement}el, {Function}done)**. They will be called with the element to be transitioned, and shall call the **done()** callback when the transition is complete.

```javascript
san.defineComponent({
    template: `
        <div>
            <button on-click="toggle">toggle</button>
            <button s-if="isShow" s-transition="opacityTrans">Hello San!</button>
            <button s-else s-transition="opacityTrans">Hello ER!</button>
        </div>
    `,

    toggle: function () {
        this.data.set('isShow', !this.data.get('isShow'));
    },

    opacityTrans: {
        enter: function (el, done) {
            var steps = 20;
            var currentStep = 0;

            function goStep() {
                if (currentStep >= steps) {
                    el.style.opacity = 1;
                    done();
                    return;
                }

                el.style.opacity = 1 / steps * currentStep++;
                requestAnimationFrame(goStep);
            }

            goStep();
        },

        leave: function (el, done) {
            var steps = 20;
            var currentStep = 0;

            function goStep() {
                if (currentStep >= steps) {
                    el.style.opacity = 0;
                    done();
                    return;
                }

                el.style.opacity = 1 - 1 / steps * currentStep++;
                requestAnimationFrame(goStep);
            }

            goStep();
        }
    }
});
```

`Note`:

There's no transition controllers built in san. They're left to the developers to implement, by means of:

- Using CSS transitions or animations. Call `done` on `transitionend` or `animationend` events.
- Using `requestAnimationFrame`. Call `done` when it's complete.
- Using `setTimeout` / `setInterval` in legacy browsers, call `done` when it's complete.
- Any way within your imagination.


Animation Controller Creator
------

If the property specified by **s-transition** directive is a `function`, it will be treated as a **transition controller creator**.

Each time a transition is requested, the **transition controller creator** gets called and it's return value is used as the **transition controller**.


```javascript
san.defineComponent({
    template: `
        <div>
            <button on-click="toggle">toggle</button>
            <button s-if="isShow" s-transition="opacityTrans">Hello San!</button>
            <button s-else s-transition="opacityTrans">Hello ER!</button>
        </div>
    `,

    toggle: function () {
        this.data.set('isShow', !this.data.get('isShow'));
    },

    opacityTrans: function () {
        return {
            enter: function (el, done) {
                var steps = 20;
                var currentStep = 0;

                function goStep() {
                    if (currentStep >= steps) {
                        el.style.opacity = 1;
                        done();
                        return;
                    }

                    el.style.opacity = 1 / steps * currentStep++;
                    requestAnimationFrame(goStep);
                }

                goStep();
            },

            leave: function (el, done) {
                var steps = 20;
                var currentStep = 0;

                function goStep() {
                    if (currentStep >= steps) {
                        el.style.opacity = 0;
                        done();
                        return;
                    }

                    el.style.opacity = 1 - 1 / steps * currentStep++;
                    requestAnimationFrame(goStep);
                }

                goStep();
            }
        }
    }
});
```

As with [the event attributes](../event/), **transition controller creator**s accept arguments.

```javascript
san.defineComponent({
    template: `
        <div>
            <button on-click="toggle">toggle</button>
            <button on-click="toggleTrans">toggle transition</button>
            <button s-if="isShow" s-transition="opacityTrans(noTransition)">Hello San!</button>
            <button s-else s-transition="opacityTrans(noTransition)">Hello ER!</button>
        </div>
    `,

    toggle: function () {
        this.data.set('isShow', !this.data.get('isShow'));
    },

    toggleTrans: function () {
        this.data.set('noTransition', !this.data.get('noTransition'));
    },

    initData: function () {
        return {
            noTransition: false
        };
    },

    opacityTrans: function (disabled) {
        return {
            enter: function (el, done) {
                if (disabled) {
                    done();
                    return;
                }

                var steps = 20;
                var currentStep = 0;

                function goStep() {
                    if (currentStep >= steps) {
                        el.style.opacity = 1;
                        done();
                        return;
                    }

                    el.style.opacity = 1 / steps * currentStep++;
                    requestAnimationFrame(goStep);
                }

                goStep();
            },

            leave: function (el, done) {
                if (disabled) {
                    done();
                    return;
                }

                var steps = 20;
                var currentStep = 0;

                function goStep() {
                    if (currentStep >= steps) {
                        el.style.opacity = 0;
                        done();
                        return;
                    }

                    el.style.opacity = 1 - 1 / steps * currentStep++;
                    requestAnimationFrame(goStep);
                }

                goStep();
            }
        }
    }
});
```

