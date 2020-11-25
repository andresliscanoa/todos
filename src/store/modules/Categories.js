import Vue from 'vue'

const state = {
    Categories        : [],
    CategoriesFilter  : [],
    Category          : {},
    categoryPagination: {
        total  : 0,
        perPage: 10,
        pages  : 1
    }
}
const getters = {
    getCategories        : state => state.Categories,
    getCategoriesFilter  : state => state.CategoriesFilter,
    getCategory          : state => state.Category,
    getCategoryPagination: state => state.categoryPagination
}
const mutations = {
    setCategories( state, payload ) {
        state.Categories = payload.map( item => {
            return {
                _id   : item._id,
                name  : item.name.charAt( 0 ).toUpperCase() + item.name.slice( 1 ),
                status: item.status ? 'Active' : 'Disabled'
            }
        } )
    },
    setCategoriesFilter( state, payload ) {
        state.CategoriesFilter = payload.map( item => {
            return {
                _id   : item._id,
                name  : item.name.charAt( 0 ).toUpperCase() + item.name.slice( 1 ),
                status: item.status
            }
        } )
    },
    setCategory( state, payload ) { state.Category = payload },
    setCategoryPagination( state, payload ) { state.categoryPagination = payload }
}
const actions = {
    async findCategoriesByUser( { commit }, query ) {
        const { items, page } = query
        return await Vue.http.get( `categories?items=${ items }&page=${ page }` )
            .then( res => {
                if ( res.status === 200 ) {
                    commit( 'setCategoriesFilter', res.body.response.data )
                    commit( 'setCategories', res.body.response.data )
                    commit( 'setCategoryPagination', res.body.response.pagination )
                } else {
                    commit( 'setCategoriesFilter', [] )
                    commit( 'setCategories', [] )
                    commit( 'setCategoryPagination', { total: 0, perPage: 10, pages: 1 } )
                }
                return res
            } )
            .catch( err => {
                return err
            } )
    },
    async updateCategoriesById( _, category ) {
        return await Vue.http.put( `categories`, category )
            .then( res => {
                return res
            } )
            .catch( err => {
                return err
            } )
    }
}

export default { state, getters, mutations, actions }
