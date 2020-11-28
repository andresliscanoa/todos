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
const isAdmin = ( to, from, next ) => {
  Vue.http.headers.common['Authorization'] = localStorage.getItem( 'token' )
  if ( store.getters.isAuth && localStorage.getItem( 'user' ) && store.getters.getUser.rol.name === 'admin' ) {
    return next()
  } else {
    next( '/403' )
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
    beforeEnter: isAuth
  },
  {
    path       : '/admin',
    name       : 'Admin',
    component  : () => import(/*webpackChunkName: "Admin"*/'../views/Admin'),
    beforeEnter: isAdmin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
