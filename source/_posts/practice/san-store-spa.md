---
title: 如何使用 san-router 建立一个单页应用的后台系统？
categories:
- practice
---

#### 引言
首先确保已经理解了[san-store](https://github.com/ecomfe/san-store) 中是否需要状态管理的内容以及相关概念，下面开始。

本项目代码在 [https://github.com/jiangjiu/san-store-spa](https://github.com/jiangjiu/san-store-spa) 可以查看。

#### 搭建环境
上一篇文档 [如何使用 san-router 建立一个单页应用的后台系统?](https://ecomfe.github.io/san/practice/san-router-spa/) 已经搭建了一个san+san-router的单页后台应用，我们在它的基础上加入san-store来管理应用状态。

```js
    // 只需安装san-store和san-update
    npm i san-update san-store --save
```

#### 状态设计
目前系统有三个频道，home、about、list。

假设这是一个类似淘宝后台管理订单的系统：

1. 不同的频道都需要同步当前订单的状态（待付款、待发货、交易完成 => orderState:1、2、3）
2. 不同频道有权利修改当前订单状态
3. 每次修改都需要异步请求到服务端进行确认

这里的状态管理混合了异步请求，为了简单起见，暂不考虑安全性及异常处理。

#### 思考
如果不使用san-store，每一个频道都需要自行发起异步请求，同时要和其他频道通信当前的订单状态，在实际业务中会是件很头疼的事儿。

使用san-store后，异步请求在action中发起而无需在不同组件中分别处理，同时store作为唯一应用状态源，无需考虑信息同步问题，系统流程清晰很多，简单可靠。

#### 创建store
首先新建一个文件来初始化和管理store。

```js
// store.js
import {updateBuilder} from 'san-update/src/index';
import {store} from 'san-store';

// 第一个action，处理边界条件和异步请求
store.addAction('changeOrderState', (state, {getState, dispatch}) => {
    // 取出当前订单状态值，如果为空就初始化为1
    const orderState = getState('orderState');
    if (!state) {
        return dispatch('fillOrderState', 1);
    }
    // 如果改变的订单值和原来状态相同或异常值就不更新了
    else if (state === orderState || state < 1 || state > 3) {
        return;
    }
    // 符合修改条件后，发起异步请求
    axios.post('/api/orderState', {state})
        .then(res => {
            // 状态码正确，修改store中的订单值
            if (res.status === 200) {
                dispatch('fillOrderState', state);
            }

        })
        .catch(error => {
            console.log(error);
        });
});
// 同步orderState值
store.addAction('fillOrderState', state => updateBuilder().set('orderState', state));

// 给订单状态一个初始值
store.dispatch('fillOrderState', 1);
```
#### 初始值
看到上面的`store.dispatch('fillOrderState', 1)`了吗？
这是为了给订单状态一个初始值。
为什么会这样做？

也许你会想到san-store手动实例化store时中提供了initData属性:

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

这确实是个很不错的初始办法。
可惜的是，`connect.san`方法只能连接san-store默认提供的store，手动实例化的store无法使用`connect.san`方法。

而且erik和灰大在设计之初认为：

1. store应该只存在一个（按常理出牌），如果提供连接其他store的方法，可能会在业务中被玩坏
2. 大部分初始值都是异步获取的，仍然需要dispatch action获得

所以当初并没有提供手动指定store进行连接的能力。
好消息是，我们会在近期开放这个功能，敬请期待。

#### 入口文件引入store.js
别忘了在main.js中添加store.js。

```js
// 入口文件 main.js
import './store';
```

#### 修改频道

为不同频道增加显示以及修改订单状态。

首先修改Home频道。

```js
// 修改Home.js
import {connect} from 'san-store';
import san from 'san';

const Home = san.defineComponent({
    template: `
        <div>
            <p>目前状态：{{orderState}}</p>
            <button on-click="onClick">订单更改为状态2：待发货</button>
        </div>
    `,
    onClick() {
        // 改变订单状态至待发货，简单起见就不做成下拉框可选形式了
        this.actions.changeOrderState(2);
    }
});

// 连接这个组件至store
export default connect.san(
    {orderState: 'orderState'},
    {changeOrderState: 'changeOrderState'}
)(Home);

```

然后修改About频道。

```js
// 修改 About.js
import {connect} from 'san-store';
import san from 'san';

const About = san.defineComponent({
    template: `
        <div>
            <span>目前状态：{{orderState}}</span>
            <button on-click="onClick">订单更改为状态3：交易完成</button>
        </div>
    `,

    onClick() {
        // 改变订单状态至交易完成，简单起见就不做成下拉框可选形式了
        this.actions.changeOrderState(3);
    }
});

export default connect.san(
    {orderState: 'orderState'},
    {changeOrderState: 'changeOrderState'}
)(About);
```

就改两个频道好了。
可以看到，不同路由下（Home、About）都正确显示了订单状态orderState，同时不同频道修改成不同的订单状态也无需手动监听通信，san-store自动完成了orderState的更新。

#### 总结
以上只是一个简单的例子，演示了后台系统如何添加store来管理应用状态。

>我们并不认为 san-store 适合所有场景。统一的进行应用状态管理，只有当你的应用足够大时，它带来维护上的便利才会逐渐显现出来。如果你只是开发一个小系统，并且预期不会有陆续的新需求，那我们并不推荐你使用它。大多数增加可维护性的手段意味着拆分代码到多处，意味着你没有办法在实现一个功能的时候一路到尾畅快淋漓，意味着开发成本可能会上升。

所以，你应该根据你要做的是一个什么样的应用，决定要不要使用 san-store。







