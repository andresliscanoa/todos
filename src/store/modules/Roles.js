import Vue from 'vue'

const state = {
    Roles: []
}
const getters = {
    getRoles: state => state.Roles
}
const mutations = {
    setRoles( state, payload ) { state.Roles = payload }
}
const actions = {
    async findRoles( { commit } ) {
        return await Vue.http.get( 'roles' )
            .then( res => {
                if ( res.status === 200 ) {
                    commit( 'setRoles', res.body.response )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
