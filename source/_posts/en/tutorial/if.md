---
title: Conditional Rendering
categories:
- tutorial
---


s-if
------

**s-if** directive can be used for conditional rendering. The element will be rendered if and only if the condition evaluates to true.

`Note`: The element will be removed rather than hidden when the condition is not satisfied.

```html
<span s-if="isOK">Hello San!</span>
```

The **s-if** directive can contain any type of [expression](../template/#Expression).

```html
<span s-if="isReady && isActive">Hello San!</span>
```

`Note`：All JavaScript falsy values are considered false: 0, empty string, null, undefined, NaN, etc.

s-elif
------

`> 3.2.3`

**s-elif** directive can be used to add a condition branch for **s-if**. The **s-elif** directive can contain any type of [expression](../template/#Expression).

```html
<span s-if="isActive">Active</span>
<span s-elif="isOnline">Pending</span>
```

`Note`：**s-elif** element must immediately follow a **s-if** or **s-elif** element. An **elif not match if** exception will be thrown if used otherwise.


s-else-if
------

`> 3.5.6`

**s-else-if** directive is an alias for **s-elif** directive, they're effectively the same.

```html
<span s-if="isActive">Active</span>
<span s-else-if="isOnline">Pending</span>
```


s-else
------

**s-else** directive can be used to specify a condition-not-satisfied branch for **s-if**. **s-else** have no value.

```html
<span s-if="isOnline">Hello!</span>
<span s-else>Offline</span>
```

`Note`：**s-else** element must immediately follow a **s-if** or **s-elif** element. An **else not match if** exception will be thrown if used otherwise.


Virtual Element
------

In san templates, only contents of **template** are rendered, NOT including the **template** element itself. By applying an **if** directive for **template** element, multiple elements (without a redundant parent element) can be rendered regarding to the **if** condition.

```html
<div>
    <template s-if="num > 10000">
        <h2>biiig</h2>
        <p>{{num}}</p>
    </template>
    <template s-elif="num > 1000">
        <h3>biig</h3>
        <p>{{num}}</p>
    </template>
    <template s-elif="num > 100">
        <h4>big</h4>
        <p>{{num}}</p>
    </template>
    <template s-else>
        <h5>small</h5>
        <p>{{num}}</p>
    </template>
</div>
```

