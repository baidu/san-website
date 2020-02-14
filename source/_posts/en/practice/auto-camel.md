---
title: Auto camel when data bind
categories:
- practice
---

In the san component, the key value of data must follow the camelCase naming convention, and the kebab-case specification should not be used.

## Scenes 1

When a parent component calls a child component and performs data binding, if a property is written using kebab-case, san will automatically convert it to camelCase and then pass it to the child component. The following example illustrates this:

### Example 1

```javascript
class Child extends san.Component {
  static template = `
    <ol>
      <li>{{dataParent}}</li>
      <li>{{data-parent}}</li> 
    </ol>
  `;
}

class Parent extends san.Component {
  static template = `
    <div>
      <san-child data-parent="data from parent!"/>
    </div>
  `;

  static components = {
    'san-child': Child
  };
}

new Parent().attach(document.body);
```

<p data-height="265" data-theme-id="0" data-slug-hash="vJQgWm" data-default-tab="js,result" data-user="mly-zju" data-embed-version="2" data-pen-title="vJQgWm" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/vJQgWm/">vJQgWm</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Analyse

In the above example, the parent component calls the child component, passing in the "data from parent!" string for the `data-parent` property. In the sub-component, the value of the `dataParent` and `data-parent` attributes are output in the li tag at the same time. It can be seen that `dataParent` prints out the value bound to the parent component, as a comparison, `data-parent ` did not output the binding value we expected. As you can see from this example, for incoming property key values, San will automatically convert the kebab-case method to camelCase. In contrast, in native html tags, there is no auto-camel feature. If we pass in a custom kebab-case method, we can use `dom.getAttribute('kebab-case') to read. The San template differs from the native html in that it deserves our attention.

The auto camel in this scene is very confusing. This feature makes us mistakenly think that in development, when we define the property key values of components, we can mix camelCase and kebab-case as we like, because anyway, san will automatically help. We convert to the camelCase form. So, isn't that really the case? Look at scene two.

## Scenes 2

In scenario 1, the parent component binds a kebab-case method property to the child component and is automatically converted to camelCase. So what happens if the initial data property returned by itself is a kebab-case type in the child component? Let's look at the second example:

### Example 2

```javascript
class Child extends san.Component {
  static template = `
    <ol>
      <li>{{dataSelf}}</li>
      <li>{{data-self}}</li> 
    </ol>
  `;

  initData() {
    return {
      'data-self': 'data from myself!'
    }
  }
}

new Child().attach(document.body);
```

<p data-height="265" data-theme-id="0" data-slug-hash="QMJpvL" data-default-tab="js,result" data-user="mly-zju" data-embed-version="2" data-pen-title="QMJpvL" class="codepen">See the Pen <a href="https://codepen.io/mly-zju/pen/QMJpvL/">QMJpvL</a> by Ma Lingyang (<a href="https://codepen.io/mly-zju">@mly-zju</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Analyse

In the above example, the Child component's initial data contains a data with a key value of `data-self`. We print them to the li tag with `dataSelf` and `data-self` respectively. As you can see, neither of them correctly prints out our initialized values. Explain that for its own data property, if the key value of the property is not in the form of camelCase, San does not perform auto camel conversion on it, so we can't get this data in any way.

## Principle analysis

In the compile process of San, parsing the template returns an instance of the ANODE class. When the attribute is bound in template, the information of the attribute object is resolved to the props attribute in the ANODE instance. For subcomponents, their own data binds are generated based on the parent component's aNode.props.

In San, when the non-root component does data bindings, it will do auto camel processing when accepting the aNode.props step of the parent component. This explains the above two examples. After the parent component kebab property is passed in, the child component camel property behaves normally, and the rest are abnormal. In fact, in the source code of San, we can find the relevant handler:

```javascript
function kebab2camel(source) {
    return source.replace(/-([a-z])/g, function (match, alpha) {
        return alpha.toUpperCase();
    });
}

function camelComponentBinds(binds) {
    var result = new IndexedList();
    binds.each(function (bind) {
        result.push({
            name: kebab2camel(bind.name),
            expr: bind.expr,
            x: bind.x,
            raw: bind.raw
        });
    });

    return result;
}
```

In the binding process of generating subcomponents, it is because of the call to the function of camelComponentBinds that auto camel is available.

## Conclusion

The auto camel of San only applies to data binding when the parent component calls the child component. For the initial data of a component itself, if the property is kebab-case, we will not get the data correctly. Therefore, in the process of writing the San component, we should consciously strictly follow the camelCase specification for the attribute key values in data.