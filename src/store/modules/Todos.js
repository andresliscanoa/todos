import Vue from 'vue'

const state = {
    Todos         : [],
    TodosCalendar : [],
    Todo          : {
        _id        : '',
        title      : '',
        description: '',
        category   : {},
        start      : '',
        deadline   : '',
        status     : 'Pending',
        user       : {},
        createdAt  : ''
    },
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
    getTodosCalendar : state => state.TodosCalendar,
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
                category : {
                    _id : item.category._id,
                    name: item.category.name.charAt( 0 ).toUpperCase() + item.category.name.slice( 1 )
                },
                status   : item.status,
                user     : item.user,
                createdAt: item.createdAt.replace( 'T', ' ' ).substr( 0, 19 )
            }
        } )
    },
    setTodosCalendar( state, payload ) {
        state.TodosCalendar = payload.map( item => {
            return {
                _id  : item._id,
                name : item.title,
                start: item.start ? item.start.replace( 'T', ' ' ).substr( 0, 16 ) : item.createdAt.replace( 'T', ' ' ).substr( 0, 16 ),
                end  : item.deadline ? item.deadline.replace( 'T', ' ' ).substr( 0, 16 ) : '',
                color: item.status === 'Pending' ? 'pink lighten-2' : item.status === 'Overdue' ? 'orange' : 'teal lighten-2',
                timed: false,
                user : {
                    _id: item.user._id
                }
            }
        } )
    },
    setTodo( state, payload ) {
        state.Todo = {
            _id        : payload._id,
            category   : {
                _id : payload.category._id,
                name: payload.category._id
            },
            createdAt  : payload.createdAt.replace( 'T', ' ' ).substr( 0, 19 ),
            deadline   : payload.deadline ? payload.deadline.replace( 'T', ' ' ).substr( 0, 19 ) : '',
            description: payload.description,
            start      : payload.start ? payload.start.replace( 'T', ' ' ).substr( 0, 19 ) : '',
            status     : payload.status,
            title      : payload.title,
            user       : {
                _id  : payload.user._id,
                email: payload.user.email
            }
        }
    },
    setDashboard( state, payload ) { state.dashboard = payload },
    setTodoPagination( state, payload ) { state.todoPagination = payload }
}
const actions = {
    async getTodoDashboard( { commit }, user ) {
        return await Vue.http.get( `todos/dash?user=${ user }` )
            .then( res => {
                if ( res.status === 200 ) {
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
                    commit( 'setTodosCalendar', res.body.response.data )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async getTodoById( { commit }, payload ) {
        return await Vue.http.get( `todos/one/${ payload.id }?user=${ payload.user }` )
            .then( res => {
                if ( res.status === 200 ) {
                    commit( 'setTodo', res.body.response )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async createTodo( _, todo ) {
        return await Vue.http.post( 'todos', todo )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateTodos( _, todo ) {
        return await Vue.http.put( 'todos', todo )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateTodosStatus( _, todo ) {
        return await Vue.http.put( 'todos/status', todo )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async deleteTodos( _, todo ) {
        return await Vue.http.delete( 'todos', { body: todo } )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
