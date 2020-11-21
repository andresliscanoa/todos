import Vue from 'vue'

const state = {
    Todos    : [],
    Todo     : {},
    dashboard: []
}
const getters = {
    getTodos    : state => state.Todos,
    getTodo     : state => state.Todo,
    getDashboard: state => state.dashboard
}
const mutations = {
    setTodos( state, payload ) { state.Todos = payload },
    setTodo( state, payload ) { state.Todo = payload },
    setDashboard( state, payload ) { state.dashboard = payload }
}
const actions = {
    async getTodoDashboard( { commit }, user ) {
        return await Vue.http.get( `todos/dash?user=${ user }` )
            .then( res => {
                commit( 'setDashboard', res.body.response )
                return res
            } )
            .catch( err => {
                commit( 'setDashboard', [] )
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
