import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import store from '../store'

Vue.use(Vuex)
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/Sign_in'
    },
    {
      path: '/sign_in',
      name: 'SignIn',
      component: resolve => require(['../components/SignIn.vue'], resolve)
    },
    {
      path: '/sign_up',
      name: 'SignUp',
      component: resolve => require(['../components/SignUp.vue'], resolve)
    },
    {
      path: '/recover',
      name: 'Recover',
      component: resolve => require(['../components/Recover.vue'], resolve)
    },
    {
      path: '/init/:id',
      name: 'Init',
      component: resolve => require(['../components/Init.vue'], resolve)
    },
    {
      path: '/tchat',
      name: 'Tchat',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Tchat.vue'], resolve)
    },
    {
      path: '/notification',
      name: 'Notification',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Notification.vue'], resolve)
    },
    {
      path: '/private',
      name: 'Private',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Private.vue'], resolve)
    },
    {
      path: '/public/:id',
      name: 'Public',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Public.vue'], resolve)
    },
    {
      path: '/suggested',
      name: 'Suggested',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Suggested.vue'], resolve)
    },
    {
      path: '/search',
      name: 'Search',
      meta: { requiresAuth: true },
      component: resolve => require(['../components/Search.vue'], resolve)
    },
    {
      path: '*',
      name: 'Error404',
      component: resolve => require(['../components/Error.vue'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.GET_AUTH) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    if (store.getters.GET_AUTH) {
      next({
        path: '/Private'
      })
    } else {
      next()
    }
  }
})

export default router
