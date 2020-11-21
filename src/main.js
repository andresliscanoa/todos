import Vue       from 'vue'
import App       from './App.vue'
import router    from './router'
import store     from './store'
import vuelidate from 'vuelidate'
import vuetify   from './plugins/vuetify'
import './plugins/vueResource'

Vue.config.productionTip = false
Vue.http.options.root = process.env.VUE_APP_API
Vue.http.interceptors.push( function () {
  return function ( response ) {
    if ( response.status === (401 || 403) ) {
      localStorage.removeItem( 'token' )
      return router.push( '/singIn' )
    }
  }
} )
Vue.use( vuelidate )

new Vue( {
  router,
  store,
  vuetify,
  render: h => h( App )
} ).$mount( '#app' )
