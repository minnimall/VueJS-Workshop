import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => {
        if (err.name !== 'NavigationDuplicated' && err.name !== 'NavigationRedirected') {
          throw err
        }
    })
}

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/port',
    name: 'port',
    component: () => import('../views/Portfolio.vue')
  },
  { 
    path: '/toolbar',
    name: 'toolbar',
    component: () => import('../views/Toolbar.vue'),
    children:[ // ส่วนของ Nest Route
      {
        path: '/exam',
        name: 'exam',
        component: () => import('../views/Exam.vue')
      },
      {
        path: '/apicon',
        name: 'apicon',
        component: () => import('../views/Apicon.vue')
      },
      {
        path: '/grade',
        name: 'grade',
        component: () => import('../views/Grade.vue')
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/main'
      },
      {
        path: 'main',
        name: 'main',
        component: () => import('../views/Main.vue')
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('../views/ProductDetail.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../views/user/Cart.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../views/user/Orders.vue')
      },
      // ฝั่งร้านค้า
      {
        path: 'shop',
        name: 'shop-home',
        component: () => import('../views/shop/ShopDashboard.vue'),
        meta: { role: 'shop' }
      },
      {
        path: 'shop/products',
        name: 'shop-products',
        component: () => import('../views/shop/ShopProducts.vue'),
        meta: { role: 'shop' }
      },
      {
        path: 'shop/products/new',
        name: 'shop-product-new',
        component: () => import('../views/shop/ShopProductForm.vue'),
        meta: { role: 'shop'}
      },
      {
        path: 'shop/products/:id/edit',
        name: 'shop-product-edit',
        component: () => import('../views/shop/ShopProductForm.vue'),
        meta: { role: 'shop' }
      },
      {
        path: 'shop/orders',
        name: 'shop-orders',
        component: () => import('../views/shop/ShopOrder.vue'),
        meta: { role: 'shop' }
      },
      // ฝั่งแอดมิน
      {
        path: 'admin',
        name: 'admin-home',
        component: () => import('../views/admin/AdminDashboard.vue'),
        meta: { role: 'admin' }
      },
      {
        path: 'admin/users',
        name: 'admin-users',
        component: () => import('../views/admin/AdminUsers.vue'),
        meta: { role: 'admin' }
      },
      {
        path: 'admin/products',
        name: 'admin-products',
        component: () => import('../views/admin/AdminProducts.vue'),
        meta: { role: 'admin'}
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// กันพิมพ์เข้า path โดยตรง
router.beforeEach((to, from, next) => {
  const user = store.state.user
  const role = store.state.token && user ? user.role : null

  const need = to.meta && to.meta.role
  if (need && role !== need) {
    return next({ name: role ? 'main' : 'login' })
  }
  next()
})

export default router
