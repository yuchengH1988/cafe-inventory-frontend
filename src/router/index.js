import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '../views/NotFound.vue'
import SignIn from '../views/Signin.vue'
import Records from '../views/Records.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/signin'

    },
    {
      path: '/signin',
      name: 'sign-in',
      component: SignIn
    },
    {
      path: '/records',
      name: 'records',
      component: Records
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('../views/Charts.vue')
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
    }
  ]
})

export default router