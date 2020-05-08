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

The **fragment** element serves as an invisible wrapper, allowing a block of multiple elements to be rendered without a parent element. By applying an **if** directive to the **fragment** element, we can render a block of multiple elements regarding to the **if** condition.

```html
<div>
    <fragment s-if="num > 10000">
        <h2>biiig</h2>
        <p>{{num}}</p>
    </fragment>
    <fragment s-elif="num > 1000">
        <h3>biig</h3>
        <p>{{num}}</p>
    </fragment>
    <fragment s-elif="num > 100">
        <h4>big</h4>
        <p>{{num}}</p>
    </fragment>
    <fragment s-else>
        <h5>small</h5>
        <p>{{num}}</p>
    </fragment>
</div>
```

`Note`: **fragment** is supported since 3.8.3, for older versions please use **template** instead. The name **fragment** is more consistent with the HTML semantic so it's recommended to upgrade san to the latest version.
