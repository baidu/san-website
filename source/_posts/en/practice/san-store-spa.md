---
title: How to use san-store to implement state management of the backend system?
categories:
- practice
---

#### Introduction
First make sure you understand the necessity of state management content and related concepts in [san-store](https://github.com/baidu/san-store). Here we go.

This project code can be viewed in [https://github.com/jiangjiu/san-store-spa](https://github.com/jiangjiu/san-store-spa).

#### Setup
The previous document [How to use san-router to create a back-end system for a single-page application?](https://baidu.github.io/san/practice/san-router-spa/) has built a single-page back-end application with san+san-router. We added san-store to manage the application state based on it.

```js
    // only need to install san-store and san-update
    npm i san-update san-store --save
```

#### State design
Currently the system has three channels, home, about, and list.

Suppose this is a system similar to e-commerce back-office orders management

1. Different channels need to synchronize the status of the current order (pending payment, pending delivery, transaction completed => orderState:1、2、3)
2. Different channels have the permission to modify the current order status
3. Each modification requires an asynchronous request to the server for confirmation

The state management here mixes asynchronous requests, and for the sake of simplicity, security and exception handling are not considered.

#### Thinking
If you do not use san-store, each channel needs to initiate an asynchronous request by itself, and it is a headache in the actual business to communicate the current order status with other channels.

After using san-store, asynchronous requests are initiated in the action without having to deal with them separately in different components. At the same time, store is the only application state source, no need to consider the information synchronization problem, the system flow is clear, simple and reliable.

#### Create store
First create a new file to initialize and manage the store.

```js
// store.js
import {updateBuilder} from 'san-update/src/index';
import {store} from 'san-store';

// First action: handling boundary conditions and asynchronous requests
store.addAction('changeOrderState', (state, {getState, dispatch}) => {
    // Take the current order status value, initialize to 1 if it is empty
    const orderState = getState('orderState');
    if (!state) {
        return dispatch('fillOrderState', 1);
    }
    // Not update if the changed order value is the same as the original state or is the abnormal value
    else if (state === orderState || state < 1 || state > 3) {
        return;
    }
    // Initiate an asynchronous request after the modification condition is met
    axios.post('/api/orderState', {state})
        .then(res => {
            // The status code is correct, modify the order value in the store
            if (res.status === 200) {
                dispatch('fillOrderState', state);
            }

        })
        .catch(error => {
            console.log(error);
        });
});
// Synchronize orderState value
store.addAction('fillOrderState', state => updateBuilder().set('orderState', state));

// Give the order status an initial value
store.dispatch('fillOrderState', 1);
```
#### Initial value
See the `store.dispatch('fillOrderState', 1)` above?
This is to give the order status an initial value.
Why we do it in this way?

Maybe you will think of the `initData` property provided by san-store when manually instantiating the store:

```js
let myStore = new Store({
    initData: {
        user: {
            name: 'your name'
        }
    },

    actions: {
        changeUserName(name) {
            return builder().set('user.name', name);
        }
    }
})
```

This is indeed a very good initial approach.
Unfortunately, the `connect.san` method can only be connected to the store provided by san-store by default. The manually instantiated store cannot use the `connect.san` method.

And at the beginning of the design, Erik and Gray think:

1. Store should only have one (by common sense), if you provide a way to connect to other stores, unpredictable errors may occur in the business.
2. Most of the initial values are obtained asynchronously and still require `dispatch action` to get

So San didn't provide the ability to manually specify the store to connect.
The good news is that we will be opening this feature in the near future, so stay tuned.

#### Import store.js in the entry file.
Don't forget to add `store.js` to `main.js`.

```js
// entry file main.js
import './store';
```

#### Modify channel

Add displays to different channels and method to modify order status.

First, modify the Home channel.

```js
// modify Home.js
import {connect} from 'san-store';
import san from 'san';

const Home = san.defineComponent({
    template: `
        <div>
            <p>current status: {{orderState}}</p>
            <button on-click="onClick">Order changed to status 2: pending delivery</button>
        </div>
    `,
    onClick() {
        // Change the order status to be shipped, for the sake of simplicity, it is not made into a drop-down box.
        this.actions.changeOrderState(2);
    }
});

// Connect this component to the store
export default connect.san(
    {orderState: 'orderState'},
    {changeOrderState: 'changeOrderState'}
)(Home);

```

Then modify the About channel.

```js
// modify About.js
import {connect} from 'san-store';
import san from 'san';

const About = san.defineComponent({
    template: `
        <div>
            <span>current status: {{orderState}}</span>
            <button on-click="onClick">Order changed to status 3: transaction completed</button>
        </div>
    `,

    onClick() {
        // Change the order status to the transaction completed. For the sake of simplicity, the drop-down box is not available.
        this.actions.changeOrderState(3);
    }
});

export default connect.san(
    {orderState: 'orderState'},
    {changeOrderState: 'changeOrderState'}
)(About);
```

Just change the two channels.
It can be seen that the order status orderState is correctly displayed under different routes (Home, About), and different channels are modified into different order states without manual monitoring communication. The san-store automatically completes the orderState update.

#### Summary
The above is just a simple example that demonstrates how the background system adds a store to manage application state.

> We don't think san-store is suitable for all scenarios. Only when your application is large enough, the unified maintenance of application state management will gradually show the convenience of maintenance. If you are only developing a small system and anticipate that there will be no new requirements, we do not recommend you to use it. Most methods of increasing maintainability mean splitting code into multiple locations, meaning that you have no way to get through the way when you implement a feature, which means development costs may increase.

So, you should decide whether you want to use san-store depending on what kind of application you are going to do.







