<template>
  <v-sheet>
    <v-layout justify-center row wrap>
      <v-flex xs12>
        <v-card color="transparent" flat>
          <v-app-bar color="transparent" flat>
            <v-toolbar-title>
              <span class="text-subtitle-1 px-5">CATEGORIES</span>
              <v-btn icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar-title>
            <v-spacer/>
            <v-btn
                class="mx-1"
                icon
                @click.native="$emit('closeCategoriesSheet')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text>
            <v-container>
              <v-layout justify-center row wrap>
                <v-flex xs12>
                  <v-data-table
                      :headers="headers"
                      :item-key="this.categories._id"
                      :items="this.categories"
                      :items-per-page="itemsPagination"
                      :loading="loading"
                      :page.sync="page"
                      class="elevation-1"
                      hide-default-footer
                      mobile-breakpoint="450"
                  >
                    <template v-slot:item.name="items">
                      <v-edit-dialog
                          :return-value.sync="items.item.name"
                          @save="save(items.item)"
                      >
                        {{ items.item.name }}
                        <template v-slot:input>
                          <v-text-field
                              v-model="items.item.name"
                              color="purple"
                              label="Edit"
                              single-line
                          />
                        </template>
                      </v-edit-dialog>
                    </template>
                    <template v-slot:item.status="items">
                      <v-edit-dialog
                          :return-value.sync="items.item.status"
                          @save="save(items.item)"
                      >
                        {{ items.item.status }}
                        <template v-slot:input>
                          <v-select
                              v-model="items.item.status"
                              :items="itemStatus"
                              color="purple"
                              label="Status"
                          />
                        </template>
                      </v-edit-dialog>
                    </template>
                    <template slot="no-data">
                      <v-alert
                          :value="true"
                          color="purple lighten-4"
                          dark
                          icon="mdi-alert"
                      >
                        No categories created or no data found...
                      </v-alert>
                    </template>
                  </v-data-table>
                </v-flex>
                <v-flex xs12>
                  <v-layout justify-end row wrap>
                    <v-flex lg2 mt-3 sm2 xs4>
                      <span class="text-caption">TOTAL ITEMS: {{ pagination.total }}</span>
                    </v-flex>
                    <v-flex lg2 mx-5 sm2 xs4>
                      <v-select
                          v-model="itemsPagination"
                          :items="itemsPerPage"
                          color="purple"
                          label="Items per page"
                          @change="getAllCategories"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>
                <div class="text-center pt-2">
                  <v-pagination
                      v-model="page"
                      :length="this.pagination.pages"
                      circle
                      color="purple darken-3"
                      next-icon="mdi-menu-right"
                      prev-icon="mdi-menu-left"
                      total-visible="7"
                      @input="getAllCategories"
                  />
                </div>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-sheet>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name    : 'Categories',
  data    : () => ({
    category       : {
      name: ''
    },
    loading        : false,
    itemsPagination: 10,
    page           : 1,
    headers        : [
      { text: 'Name', align: 'center', sortable: 'false', value: 'name' },
      { text: 'Status', align: 'center', sortable: 'false', value: 'status' }
    ],
    itemStatus     : [ 'Active', 'Disabled' ],
    itemsPerPage   : [ 10, 25, 50, 100 ]
  }),
  computed: {
    ...mapGetters( [ 'getCategories', 'getCategoryPagination' ] ),
    categories() { return this.getCategories },
    pagination() { return this.getCategoryPagination }
  },
  methods : {
    ...mapMutations( [ 'setAlert' ] ),
    ...mapActions( [ 'findCategoriesByUser', 'updateCategoriesById' ] ),
    async save( item ) {
      const category = {
        id    : item._id,
        name  : item.name,
        status: item.status === 'Active'
      }
      await this.updateCategoriesById( category )
          .then( res => {
            if ( res.status === 200 ) {
              this.showConfirmAlert( res.body )
              this.getAllCategories()
            } else if ( res.status === 400 ) {
              this.showErrorAlert( res.body )
            }
          } )
    },
    async getAllCategories() {
      this.loading = true
      const query = {
        items: this.itemsPagination,
        page : this.page
      }
      await this.findCategoriesByUser( query )
          .then( res => {
            this.loading = false
            if ( res.status === 200 ) {
              this.showConfirmAlert( res.body )
            } else if ( res.status === 400 ) {
              this.showErrorAlert( res.body )
            }
          } )
    },
    showConfirmAlert( payload ) {
      this.setAlert( true )
      this.colorAlert = 'green'
      this.iconAlert = 'mdi-check'
      this.statusAlert = payload.status
      this.messageAlert = payload.message
      this.errorsAlert = null
      this.infoAlert = null
      setTimeout( () => this.setAlert( false ), 4000 )
    },
    showErrorAlert( payload ) {
      this.setAlert( true )
      this.colorAlert = 'red'
      this.iconAlert = 'mdi-alert'
      this.statusAlert = payload.status
      this.messageAlert = payload.message
      this.errorsAlert = payload.response && payload.response.err || null
      this.infoAlert = payload.response && payload.response.info || null
    }
  }
}
</script>
