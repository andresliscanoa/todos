import Vue  from 'vue'
import Vuex from 'vuex'

import Categories from '@/store/modules/Categories'
import Roles      from '@/store/modules/Roles'
import Todos      from '@/store/modules/Todos'
import Users      from '@/store/modules/Users'

Vue.use( Vuex )

export default new Vuex.Store( {
    state    : {
        alert: {
            alert  : false,
            color  : 'transparent',
            icon   : '',
            status : '',
            message: '',
            errors : [],
            info   : {}
        }
    },
    getters  : {
        getAlert: state => state.alert
    },
    mutations: {
        setErrorAlert( state, payload ) {
            state.alert.alert = true
            state.alert.color = 'red'
            state.alert.icon = 'mdi-alert'
            state.alert.status = payload.status
            state.alert.message = payload.message
            state.alert.errors = payload.response !== undefined ? payload.response.err : null
            state.alert.info = payload.response !== undefined ? payload.response.info : null
        },
        setConfirmAlert( state, payload ) {
            state.alert.alert = true
            state.alert.color = 'green'
            state.alert.icon = 'mdi-check'
            state.alert.status = payload.status
            state.alert.message = payload.message
            state.alert.errors = null
            state.alert.info = null
        },
        setAlertOff( state ) {
            state.alert.alert = false
            state.alert.color = 'transparent'
            state.alert.icon = ''
            state.alert.status = ''
            state.alert.message = ''
            state.alert.errors = []
            state.alert.info = {}
        }
    },
    actions  : {},
    modules  : {
        Categories,
        Roles,
        Todos,
        Users
    }
} )
