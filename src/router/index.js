import store     from '../store/index'
import Vue       from 'vue'
import VueRouter from 'vue-router'
import Login     from '../views/Login.vue'

Vue.use(VueRouter)
const isAuth = ( to, from, next ) => {
  Vue.http.headers.common['Authorization'] = localStorage.getItem( 'token' )
  if ( store.getters.isAuth && localStorage.getItem( 'user' ) ) {
    return next()
  } else {
    next( '/singIn' )
    store.commit( 'removeAuth' )
  }
}

const routes = [
  {
    path     : '/singIn',
    name     : 'Login',
    component: Login
  },
  {
    path       : '/',
    name       : 'Home',
    component  : () => import(/*webpackChunkName: "Home"*/'../views/Home'),
    beforeEnter: isAuth,
    children   : []
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
