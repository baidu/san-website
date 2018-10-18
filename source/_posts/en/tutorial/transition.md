---
title: 过渡
categories:
- tutorial
---

在视图中，过渡效果是常见的场景。平滑的过渡动画能够给用户更好的感官体验。san 提供了基础的过渡机制，你可以基于此开发丰富的过渡效果。

`版本`：>= 3.3.0


s-transition
-----

在元素上通过 **s-transition** 指令，可以声明过渡动画控制器。

```html
<button s-transition="opacityTransition">click</button>
```

这个对象是元素 owner 的成员。

```javascript
san.defineComponent({
    template: '<div><button s-transition="opacityTransition">click</button></div>',

    opacityTransition: {
        // 过渡动画控制器的结构在下文中描述
        // ...
    }
});
```

我们通常把 **s-transition** 和条件或循环指令一起使用。

```html
<button s-transition="opacityTransition" s-if="allowEdit">Edit</button>
<b s-transition="opacityTransition" s-else>Edit not allow</b>
```


**s-transition** 声明的过渡动画控制器可以是 owner 组件的深层成员。

```javascript
san.defineComponent({
    template: '<div><button s-transition="trans.opacity">click</button></div>',

    trans: {
        opacity: {
            // 过渡动画控制器的结构在下文中描述
            // ...
        }
    }
});
```

`注意`：**s-transition** 只能应用在具体的元素中。template 这种没有具体元素的标签上应用 **s-transition** 将没有效果。


Animation Controller
------

过渡动画控制器是一个包含 **enter** 和 **leave** 方法的对象。

**enter** 和 **leave** 方法的签名为 **function({HTMLElement}el, {Function}done)**。san 会把要过渡的元素传给过渡动画控制器，控制器在完成动画后调用 **done** 回调函数。

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

`提示`：

san 把动画控制器留给应用方实现，框架本身不内置动画控制效果。应用方可以：

- 使用 css 动画，在 transitionend 或 animationend 事件监听中回调 done
- 使用 requestAnimationFrame 控制动画，完成后回调 done
- 在老旧浏览器使用 setTimeout / setInterval 控制动画，完成后回调 done
- 发挥想象力


Animation Controller Creator
------

**s-transition** 指令声明对应的对象如果是一个 function，san 将把它当成 **过渡动画控制器 Creator**。

每次触发过渡动画前，san 会调用**过渡动画控制器 Creator**，用其返回的对象作为过渡动画控制器。


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

和[事件声明](../event/)类似，**过渡动画控制器 Creator**调用支持传入参数。

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

