import Vue from 'vue'

const state = {
    Users: [],
    User : JSON.parse( localStorage.getItem( 'user' ) ) || {},
    token: localStorage.getItem( 'token' ) || null
}
const getters = {
    getUsers: state => state.Users,
    getUser : state => state.User,
    isAuth  : state => state.token
}
const mutations = {
    setUsers( state, payload ) {
        state.Users = payload
    },
    setUser( state, payload ) {
        localStorage.setItem( 'user', JSON.stringify( payload ) )
        state.User = payload
    },
    setAuth( state, payload ) {
        localStorage.setItem( 'token', payload )
        state.token = payload
    },
    removeAuth( state ) {
        state.token = null
        state.User = {}
        localStorage.removeItem( 'token' )
        localStorage.removeItem( 'user' )
    }
}
const actions = {
    async singIn( { commit }, user ) {
        return await Vue.http.post( 'users/sing/in', user )
            .then( res => {
                commit( 'setAuth', res.body.response.token )
                commit( 'setUser', res.body.response.user )
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    logOut( { commit } ) {
        commit( 'removeAuth' )
        commit( 'setUser', {} )
        commit( 'setUsers', [] )
    }
}

export default { state, getters, mutations, actions }
