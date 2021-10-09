---
title: How to use san-composition to organize code by function？
categories:
- practice
---


#### Introduction

As the business continues to evolve, front-end projects tend to become more and more complex, and the way we used options to define components in the past may become less and less readable as we iterate through the functionality. When we add additional functionality to a component, we usually need to modify (initData, attached, computed, etc.) multiple blocks of code; and in some cases, it clearly makes more sense to organize the code by functionality and facilitate fine-grained code reuse.

The Composition API provides a set of methods corresponding to the key that defines the component options to define the properties and methods of the component, allowing developers to organize the code by logical correlation, thus improving the readability and maintainability of the code.

####  Usage

**NPM**

```
npm i --save san-composition
```

####  Basic usage

When defining a component, we usually need to define templates, initialize data, define methods, add lifecycle hooks, and so on. When defining a component using the Composition API, instead of declaring properties and methods using an options object, we use the methods corresponding to each option to solve the definition of various properties and methods of the component.

> Note: The Composition API methods can only be executed during the first function argument of the defineComponent method.

##### Defining Template

Use the [template](https://github.com/baidu/san-composition/blob/master/docs/api.md#template) method to define the template for the component.

```js
import san from 'san';
import { defineComponent, template } from 'san-composition';

export default defineComponent(() => {
    template(`
        <div>
            <span>count: {{ count }} </span>
            <button on-click="increment"> +1 </button>
        </div>
    `);
}, san);

```

##### Defining Data

Use the [data](https://github.com/baidu/san-composition/blob/master/docs/api.md#data) method to initialize a data item of the component.

```js
import san from 'san';
import { defineComponent, template, data } from 'san-composition';

const App = defineComponent(() => {
    template(/* ... */);
    const count = data('count', 1);
}, san);
```

The return value of `data` is an object that contains get, set, merge, splice and other methods. We can use the methods on the object to get and modify the data.

##### Defining Computed Data

Use the [computed](https://github.com/baidu/san-composition/blob/master/docs/api.md#computed) method to define a computed data item.

```js
const App =  defineComponent(() => {
    template(/* ... */);

    const name = data('name', {
        first: 'Donald',
        last: 'Trump'
    });

    const fullName = computed('fullName',  function() {
        return name.get('first') + ' ' + name.get('last');
    });
}, san);
```


##### Defining Filters

Use the [filters](https://github.com/baidu/san-composition/blob/master/docs/api.md#filters) method to add filters to the component.
 
```js
const App =  defineComponent(() => {
    template('<div> {{ count|triple }} </div>');

    const count = data('count', 1);
 
    filters('triple', value => value * 3);
}, san);
```


##### Defining Method

To define methods using [method](https://github.com/baidu/san-composition/blob/master/docs/api.md#method), we strongly recommend defining them according to `data` and `method` in close proximity to the business logic.


```js
import san from 'san';
import { defineComponent, template, data, method } from 'san-composition';

const App = defineComponent(() => {
    template(/* html */`
        <div>
            <span>count: {{ count }} </span>
            <button on-click="increment"> +1 </button>
        </div>
	`);
    const count = data('count', 1);
    method('increment', () => count.set(count.get() + 1));
}, san);
```

##### Lifecycle Hooks

The following [onAttached](https://github.com/baidu/san-composition/blob/master/docs/api.md#onAttached) method adds attached lifecycle hooks to the component.

```js
import san from 'san';
import {defineComponent, template, onAttached} from 'san-composition';

const App =  defineComponent(() => {
    template(/* ... */);
    onAttached(() => {
        console.log('onAttached');
    });
}, san);
```

The API related to lifecycle hooks is named by prefixing the corresponding hook with `on`, so it corresponds to the component's lifecycle hooks one by one.

| **Option API** | **Hooks in Composition API** |
| -------------- | --------------------- |
| construct      | onConstruct           |
| compiled       | onCompiled            |
| inited         | onInited              |
| created        | onCreated             |
| attached       | onAttached            |
| detached       | onDetached            |
| disposed       | onDisposed            |
| updated        | onUpdated             |
| error          | onError               |

**A complete example**

The following example shows how to define components using the Composition API.

```js
import san from 'san';
import {
    defineComponent,
    template,
    data,
    computed,
    filters,
    watch,
    components,
    method,
    onCreated,
    onAttached
} from 'san-composition';

export default defineComponent(() => {
    // 定义模板
    template(/* html */`
        <div>
            <span>count: {{ count }} </span>
            <input type="text" value="{= count =}" />
            <div>double: {{ double }} </div>
            <div>triple: {{ count|triple }} </div>
            <button on-click="increment"> +1 </button>
            <my-child></my-child>
        </div>
    `);

    // 初始化数据
    const count = data('count', 1);

    // 添加方法
    method('increment', () => count.set(count.get() + 1));

    // 监听数据变化
    watch('count', newVal => {
        console.log('count updated: ', newVal);
    });

    // 添加计算数据
    computed('double', () => count.get() * 2);

    // 添加过滤器
    filters('triple', n => n * 3);

    // 定义子组件
    components({ 'my-child': defineComponent(() => template('<div>My Child</div>'), san) });

    // 生命周期钩子方法
    onAttached(() => {
        console.log('onAttached');
    });

    onAttached(() => {
        console.log('another onAttached');
    });

    onCreated(() => {
        console.log('onCreated');
    });
}, san);

```


#### Advanced

The point of using the Composition API is to define the data, methods, lifecycle runtime logic, etc. **by function**. There is no point in using the Composition API for its own sake if you declare an entire component in a complete definition function.

This article gives some guidance on the use of the composition API in two subsections with a simple example.

- [Composition](#Composition) explains how to transform a component declared using class into an implementation using the compositional API
- [Reusability](#Reusability) builds on the previous section by describing how to break down functions **by function** and implement reuse


##### Composition

Suppose we want to develop a contact list. In terms of business logic, the component has the following functions.

1. A list of contacts, and view and favorite operations.
2. A list of favorites, as well as view and unfavorite operations.
3. Filtering contacts by form.


We'll build two versions of the same component: one with the Class API, and the other with the  Composition API.

**Building with Class API**

```js
class ContactList extends san.Component {
    static template = /* html */`
         <div class="container">
            <div class="contact-list-filter">
                <s-icon type="search">
                <s-input on-change="changeKeyword"></s-input>
            </div>

            <div class="favorite-list">
                <h2>个人收藏</h2>
                <contact-list
                    data="{{favoriteList|filterList(keyword)}}"
                    on-open="onOpen"
                    on-favorite="onFavorite"
                />
            </div>

            <div class="contact-list">
                <h2>联系人</h2>
                <contact-list
                    data="{{contactList|filterList(keyword)}}"
                    on-open="onOpen"
                    on-favorite="onFavorite"
                />
            </div>
        </div>
    `;

    initData() {
        return {
            // 功能 1
            contactList: []
            // 功能 2
            favoriteList: [],
            // 功能 3
            keyword: ''
        };
    }

    filters: {
        filterList(item, keyword) {
            // ...
        }
    },

    static components = {
        's-icon': Icon,
        's-input': Input,
        's-button': Button,
        'contact-list': ContactListComponent,
    }

    attached() {
        this.getContactList();
        this.getFavoriteList();
    }

    // 功能 1
    getContactList() {
        // ...
    }

    // 功能 2
    getFavoriteList() {
        // ...
    }

    // 功能 1 & 2
    async onOpen(item) {
        // ...
    }

    // 功能 1 & 2
    async onFavorite(item) {
        // ...
    }

    // 功能 3
    changeKeyword(value) {
        this.data.set('keyword', value);
    }
}

```

As components become more feature-rich, the logic of the Class API becomes more and more diffuse, and we often need to jump through multiple modules to read the implementation of a feature, making the code less readable. Next, we use the Composition API to organize the code by function.

**Building with Composition API**

```js
const ContactList = defineComponent(() => {
    template('/* ... */');
    components({
        's-icon': Icon,
        's-input': Input,
        's-button': Button,
        'contact-list': ContactListComponent,
    });

    // 功能 1 & 2
    method({
        onOpen: item => {/* ... */},
        onFavorite: item => {/* ... */}
    });

    filters('filterList', (item, keyword) => {
        // ...
    });

    // 功能 1
    const contactList = data('contactList', []);
    method('getContactList', () => {
        // ...
        contactList.set([/* ... */]);
    });
    onAttached(function () { this.getContactList(); });


    // 功能 2
    const favoriteList = data('favoriteList', []);
    method('getFavoriteList', () => {
        // ...
        favoriteList.set([/* ... */]);
    });
    onAttached(function () { this.getFavoriteList(); });
    

    // 功能 3
    const keyword = data('keyword', '');
    method('changeKeyword', value => {
        keyword.set(value);
    });    
}, san);
```

##### Reusability

Code organized by function can sometimes be a long block of logic, so we can consider a wrapper around the combined logic.

```js
/**
 * @file utils.js
 */

import { ... } from 'san-composition';

// 功能 1
export const useContactList = () => {
    const contactList = data('contactList', []);
    method('getContactList', () => {
        // ...
        contactList.set([/* ... */]);
    });
    onAttached(function () { this.getContactList(); });
};

// 功能 2
export const useFavoriteList = () => {
    const favoriteList = data('favoriteList', []);
    method('getFavoriteList', () => {
        // ...
        favoriteList.set([/* ... */]);
    });
    onAttached(function () { this.getFavoriteList(); });
};


// 功能 3
export const useSearchBox = () => {
    const keyword = data('keyword', '');
    method('changeKeyword', value => {
        keyword.set(value);
    });    
};

// 该 hook 函数提供一个默认名字为 filterList 的过滤器，可以通过参数修改这个过滤器的名称
export const useFilterList = ({filterList = 'filterList'}) => {
    filters(filterList, (item, keyword) => {
        // ...
    });
};

```

In addition, for some common basic UI components, we can also wrap a method.

```js
export const useUIComponents = () => {
    components({
        's-button': Button,
        's-icon': Icon,
        's-input': Input
    });
};
```

Let's refactor the contact list component a bit more.

```js
import { useContactList, useFavoriteList, useSearchBox, useUIComponents, useFilterList } from 'utils.js';
const ContactList = defineComponent(() => {
    template('/* ... */');

    useUIComponents();

    components({
        'contact-list': ContactListComponent,
    });

    method({
        onOpen: item => {/* ... */},
        onFavorite: item => {/* ... */}
    });

    useFilterList();

    // 功能 1
    useContactList();

    // 功能 2
    useFavoriteList();

    // 功能 3
    useSearchBox();
}, san);
```

Suppose a new requirement comes up and we need a new component that doesn't show favorite contacts.

```js
import { useContactList, useFavoriteList, useSearchBox, useUIComponents } from 'utils.js';
const ContactList = defineComponent(() => {
    // 模板当然也要做一些调整，这里省略了
    template('/* ... */');

    useUIComponents();

    components({
        'contact-list': ContactListComponent,
    });

    method({
        onOpen: item => {/* ... */},
        onFavorite: item => {/* ... */}
    });

    useFilterList();
    useContactList();
    useSearchBox();
}, san);
```

##### Usage of THIS

We don't recommend using `this` in the Composition API, it can cause some confusion, but sometimes you may have to use it, so be careful not to use the arrow function in the corresponding method.

```js
defineComponent(() => {
    template(/* ... */);
    const count = data('count', 1);

    // 这里定义的方法不能使用剪头函数
    method('increment', function () {
        this.dispatch('increment:count', count.get());
    });
}, san);

```

