import Vue from 'vue'

const state = {
    Todos         : [],
    Todo          : {},
    dashboard     : {
        pending : 0,
        overdue : 0,
        finished: 0
    },
    todoPagination: {
        total  : 0,
        perPage: 10,
        pages  : 1
    }
}
const getters = {
    getTodos         : state => state.Todos,
    getTodo          : state => state.Todo,
    getDashboard     : state => state.dashboard,
    getTodoPagination: state => state.todoPagination

}
const mutations = {
    setTodos( state, payload ) {
        state.Todos = payload.map( item => {
            return {
                _id      : item._id,
                title    : item.title,
                status   : item.status,
                user     : item.user,
                createdAt: item.createdAt.replace( 'T', ' ' ).substr( 0, 19 )
            }
        } )
    },
    setTodo( state, payload ) { state.Todo = payload },
    setDashboard( state, payload ) { state.dashboard = payload },
    setTodoPagination( state, payload ) { state.todoPagination = payload }
}
const actions = {
    async getTodoDashboard( { commit }, user ) {
        return await Vue.http.get( `todos/dash?user=${ user }` )
            .then( res => {
                if ( res.status === 200 ) {
                    console.log( res.body.response )
                    const pending = res.body.response.find( item => item._id === 'Pending' ) || { count: 0 }
                    const overdue = res.body.response.find( item => item._id === 'Overdue' ) || { count: 0 }
                    const finished = res.body.response.find( item => item._id === 'Finished' ) || { count: 0 }
                    commit( 'setDashboard', {
                        pending : pending.count,
                        overdue : overdue.count,
                        finished: finished.count
                    } )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async getTodosByFilters( { commit }, query ) {
        const category = query.category || null
        const status = query.status || null
        const user = query.user || null
        const start = query.start || null
        const end = query.end || null
        const items = query.items || 10
        const page = query.page || 1
        let url = `items=${ items }&page=${ page }`
        if ( category ) url += `&category=${ category }`
        if ( status ) url += `&status=${ status }`
        if ( user ) url += `&user=${ user }`
        if ( start ) url += `&start=${ start }`
        if ( end ) url += `&end=${ end }`
        return await Vue.http.get( `todos?${ url }` )
            .then( res => {
                if ( res.status === 200 ) {
                    commit( 'setTodoPagination', res.body.response.pagination )
                    commit( 'setTodos', res.body.response.data )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
