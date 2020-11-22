import Vue  from 'vue'
import Vuex from 'vuex'

import Categories from '@/store/modules/Categories'
import Todos      from '@/store/modules/Todos'
import Users      from '@/store/modules/Users'

Vue.use( Vuex )

export default new Vuex.Store( {
    state    : {
        alert: false
    },
    getters  : {
        getAlert: state => state.alert
    },
    mutations: {
        setAlert( state, payload ) { state.alert = payload }
    },
    actions  : {},
    modules  : {
        Categories,
        Todos,
        Users
    }
} )
