// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//使用懒加载形式引入组件
const UserCenter = resolve => require(['./pages/UserCenter/UserCenter.vue'],resolve)
const Order = resolve => require(['./pages/Order/Order.vue'],resolve)
const MenuList = resolve => require(['./pages/Order/MenuList.vue'],resolve)
const AlreadyOrderList = resolve => require(['./pages/Order/AlreadyOrderList.vue'],resolve)
const StoreDetail = resolve => require(['./pages/Order/StoreDetail.vue'],resolve)
const OrderDetail = resolve => require(['./pages/Order/OrderDetail.vue'],resolve)
const OrderConfirm = resolve => require(['./pages/Order/OrderConfirm.vue'],resolve)
const CommentDishes = resolve => require(['./pages/Comment/CommentDishes.vue'],resolve)
const Alipay = resolve => require(['./pages/Pay/Alipay.vue'],resolve)

// import UserCenter from './pages/UserCenter/UserCenter.vue'
// import Order from './pages/Order/Order.vue'
// import MenuList from './pages/Order/MenuList.vue'
// import AlreadyOrderList from './pages/Order/AlreadyOrderList.vue'
// import StoreDetail from './pages/Order/StoreDetail.vue'
// import OrderDetail from './pages/Order/OrderDetail.vue'
// import OrderConfirm from './pages/Order/OrderConfirm.vue'
// import CommentDishes from './pages/Comment/CommentDishes.vue'
// import Alipay from './pages/Pay/Alipay.vue'
//导入路由模块
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// import vueTap from 'v-tap';
// Vue.use(vueTap);
//引入ajax库
import axios from 'axios'
Vue.prototype.$http = axios

//mint-ui
import { Button, Cell , Radio ,Header } from 'mint-ui'

//使用Mint ui插件
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Radio.name, Radio)

const OrderHome = { template: '<div>Home</div>' }
const router = new VueRouter({
  routes: [
    {
      path: '/alreadyOrderlist',
      component: AlreadyOrderList,
    },
    {
      path: '/userCenter',
      component: UserCenter
    },
    {
      path: '/orderDetail/:orderId/:parentType',
      component: OrderDetail
    },
    {
      path: '/orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/commentDishes/:orderId/:orderNo/:evaluateStatus',
      component: CommentDishes
    },
    {
      path: '/pay/:orderId',
      component: Alipay
    },
    {
      path: '/order',
      component: Order,
      children:[
        { 
          path: '', 
          component: OrderHome
        },
        {
          path: 'menuList/:storeId/:tableId/:token/:tableName',
          component: MenuList
        },
        {
          path: 'menuList',
          component:MenuList
        },
        {
          path: 'storeDetail',
          component: StoreDetail
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue()
  }
})

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

router.push('/order/menuList')
