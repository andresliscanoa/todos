import Vue from 'vue'

const state = {
    Users     : [],
    User      : JSON.parse( localStorage.getItem( 'user' ) ) || {},
    token     : localStorage.getItem( 'token' ) || null,
    pagination: {
        total  : 0,
        perPage: 10,
        page   : 1
    }
}
const getters = {
    getUsers     : state => state.Users,
    getUser      : state => state.User,
    isAuth       : state => state.token,
    getPagination: state => state.pagination
}
const mutations = {
    setUsers( state, payload ) {
        state.Users = payload.map( item => {
            return {
                _id        : item._id,
                fulName    : item.name.last !== undefined ? item.name.first + ' ' + item.name.last : item.name.first,
                fulLastname: item.lastname.last !== undefined ? item.lastname.first + ' ' + item.lastname.last : item.lastname.first,
                email      : item.email,
                rol        : item.rol
            }
        } )
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
    },
    setPagination( state, payload ) { state.pagination = payload}
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
    },
    async uniqueUserEmail( _, email ) {
        return await Vue.http.get( `users/unique/email?value=${ email }` )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async findUsers( { commit }, query ) {
        return await Vue.http.get( `users?items=${ query.items }&page=${ query.page }` )
            .then( res => {
                if ( res.status === 200 ) {
                    commit( 'setUsers', res.body.response.data )
                    commit( 'setPagination', res.body.response.pagination )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async findUserById( _, id ) {
        return await Vue.http.get( `users/${ id }` )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async createUser( _, user ) {
        return await Vue.http.post( 'users', user )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateUserById( _, payload ) {
        const { id, user } = payload
        return await Vue.http.put( `users/${ id }`, user )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateUserRol( _, payload ) {
        return await Vue.http.put( `users/set/rol`, payload )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateUserPassword( _, payload ) {
        return await Vue.http.put( `users/set/password`, payload )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
