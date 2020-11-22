<template>
  <v-layout justify-space-around row wrap>
    <v-flex mx-10 xs12>
      <v-card color="purple lighten-4" flat>
        <v-app-bar color="transparent" dark flat>
          <v-toolbar-title><span class="text-h4">Dashboard</span></v-toolbar-title>
          <v-spacer/>
          <v-btn
              dark
              icon
              @click.native="showDash = !showDash"
          >
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text v-show="showDash">
          <v-layout justify-space-around row wrap>
            <v-flex lg3 md4 xs12>
              <dash-board-card :total="totalPending" color="yellow darken-1" title="Pending"/>
            </v-flex>
            <v-flex lg3 md4 xs12>
              <dash-board-card :total="totalOverdue" color="red" title="Overdue"/>
            </v-flex>
            <v-flex lg3 md4 xs12>
              <dash-board-card :total="totalFinished" color="green" title="Finished"/>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider dark/>
        <v-card-actions>
          <v-layout justify-center row wrap>
            <v-layout justify-space-around row wrap>
              <v-flex md2 px-2 xs12>
                <v-select
                    v-model="category"
                    :items="categoriesFilter"
                    dark
                    item-text="name"
                    item-value="_id"
                    label="Categories"
                    return-object
                >
                  <template
                      slot="selection"
                      slot-scope="data">
                    {{ data.item.name }}
                  </template>
                  <template
                      slot="item"
                      slot-scope="data">
                    {{ data.item.name }}
                  </template>
                </v-select>
              </v-flex>
              <v-flex md2 px-2 xs12>
                <v-select
                    v-model="status"
                    :items="itemStatus"
                    dark
                    label="Status"
                />
              </v-flex>
              <v-flex md2 px-2 xs12>
                <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    min-width="290px"
                    offset-y
                    transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="start"
                        v-bind="attrs"
                        v-on="on"
                        dark
                        label="Date from"
                        prepend-icon="mdi-calendar"
                        readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="start"
                      :max="`${new Date().toISOString().substr(0,10)}`"
                      color="orange"
                      min="2020-11-01"
                      @input="menuStart = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex md2 px-2 xs12>
                <v-menu
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    min-width="290px"
                    offset-y
                    transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="end"
                        v-bind="attrs"
                        v-on="on"
                        dark
                        label="Date from"
                        prepend-icon="mdi-calendar"
                        readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="end"
                      :max="`${new Date().toISOString().substr(0,10)}`"
                      :min="minEnd"
                      color="orange"
                      @input="menuEnd = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex v-if="user.rol.name==='admin'" md2 px-2 xs12>
                <v-select
                    v-model="category"
                    :items="categoriesFilter"
                    dark
                    item-text="name"
                    item-value="_id"
                    label="User"
                    return-object
                >
                  <template
                      slot="selection"
                      slot-scope="data">
                    {{ data.item.name }}
                  </template>
                  <template
                      slot="item"
                      slot-scope="data">
                    {{ data.item.name }}
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
            <v-layout justify-space-between row wrap>
              <v-layout class="px-10" justify-start row wrap>
                <v-flex xs1>
                  <v-btn dark icon outlined @click.native="listView()">
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs1>
                  <v-btn dark icon outlined @click.native="cardView()">
                    <v-icon>mdi-card-account-details</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs1>
                <v-btn dark text @click.native="filterTodos()">Search</v-btn>
              </v-flex>
              <v-flex xs1>
                <v-btn color="red" dark text @click.native="resetFilters()">Reset</v-btn>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex v-show="listViews" mx-10 pt-5 xs12>
      <v-data-table
          :headers="headers"
          :item-key="this.todos._id"
          :items="this.todos"
          :items-per-page="this.todoPagination.perPage"
          :page.sync="page"
          :search="searchTodo"
          class="elevation-1"
          mobile-breakpoint="450"
      >
        <template v-slot:item.actions="{ item }">
          <v-layout justify-space-around row>
            <v-flex v-if="item.isActive === false" class="hidden-xs-only" xs1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click.native="abrirActualizarUsuario(item._id)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar usuario</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click.native="abrirReadUser(item._id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>Ver información del usuario</span>
              </v-tooltip>
            </v-flex>
            <v-flex class="hidden-xs-only" xs1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-autorenew</v-icon>
                  </v-btn>
                </template>
                <span>Cambiar rol</span>
              </v-tooltip>
            </v-flex>
            <v-flex v-if="item.isActive === true" class="hidden-xs-only" xs1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </template>
                <span>Desactivar usuario</span>
              </v-tooltip>
            </v-flex>
            <v-flex v-if="item.isActive === false" class="hidden-xs-only" xs1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-email-send</v-icon>
                  </v-btn>
                </template>
                <span>Reenviar correo de activación</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </template>
        <template slot="no-data">
          <v-alert
              :value="true"
              color="warning"
              dark
              icon="mdi-alert"
          >
            No hay datos que mostrar...
          </v-alert>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="this.todoPagination.pages" circle color="purple darken-3"
                      next-icon="mdi-menu-right" prev-icon="mdi-menu-left" total-visible="7"/>
      </div>
    </v-flex>
    <alert :color="colorAlert" :errors="errorsAlert" :info="infoAlert" :message="messageAlert" :status="statusAlert"
           :timeOut="10000"/>
    <floating-button-menu/>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Alert                                    from '@/components/Alert'
import DashBoardCard                            from '@/components/DashBoardCard'
import FloatingButtonMenu                       from '@/components/FloatingButtonMenu'

export default {
  name      : 'Home',
  components: {
    Alert,
    DashBoardCard,
    FloatingButtonMenu
  },
  data      : () => ({
    showDash       : true,
    category       : {},
    status         : '',
    start          : '',
    menuStart      : false,
    end            : '',
    menuEnd        : false,
    itemStatus     : [ 'Pending', 'Overdue', 'Finished' ],
    colorAlert     : '',
    messageAlert   : '',
    statusAlert    : '',
    errorsAlert    : '' || [],
    infoAlert      : {},
    searchTodo     : '',
    headers        : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Title', align: 'center', sortable: 'true', value: 'title' },
      { text: 'Status', align: 'center', sortable: 'false', value: 'status' },
      { text: 'User', align: 'center', sortable: 'false', value: 'user.email' },
      { text: 'Created at', align: 'center', sortable: 'false', value: 'createdAt' }
    ],
    itemsPagination: 10,
    page           : 1,
    listViews      : true,
    cardViews      : false
  }),
  created() {
    this.filterCategories()
    this.filterTodos()
    this.dash()
  },
  computed  : {
    ...mapGetters( [ 'getUser', 'getDashboard', 'getCategoriesFilter', 'getTodos', 'getTodoPagination' ] ),
    user() { return this.getUser },
    dashboard() { return this.getDashboard },
    categoriesFilter() { return this.getCategoriesFilter },
    todos() { return this.getTodos },
    todoPagination() { return this.getTodoPagination },
    totalPending() {
      return this.getDashboard.pending
    },
    totalOverdue() {
      return this.getDashboard.overdue
    },
    totalFinished() {
      return this.getDashboard.finished
    },
    minEnd() {
      return this.start ? this.start : '2020-11-01'
    }
  },
  methods   : {
    ...mapMutations( [ 'setAlert' ] ),
    ...mapActions( [ 'getTodoDashboard', 'findCategoriesByUser', 'getTodosByFilters' ] ),
    async dash() {
      await this.getTodoDashboard( this.user._id )
    },
    async filterTodos() {
      const query = {
        items   : this.itemsPagination || 10,
        page    : this.page || 1,
        category: this.category._id || null,
        status  : this.status || null,
        user    : this.user.rol.name === 'admin' ? null : this.user._id,
        start   : this.start || null,
        end     : this.end || null
      }
      await this.getTodosByFilters( query )
    },
    async filterCategories() {
      const query = {
        items: 100,
        page : 1
      }
      await this.findCategoriesByUser( query )
          .then( res => {
            if ( res.status !== 200 ) {
              this.setAlert( true )
              this.colorAlert = 'red'
              this.statusAlert = res.body.status
              this.messageAlert = res.body.message
              this.errorsAlert = res.body.response && res.body.response.err || null
              this.infoAlert = res.body.response && res.body.response.info || null
            }
          } )
    },
    async resetFilters() {
      this.start = ''
      this.end = ''
      this.category = {}
      this.status = ''
      const query = {
        items: this.itemsPagination || 10,
        page : this.itemsPage || 1,
        user : this.user.rol.name === 'admin' ? null : this.user._id
      }
      await this.getTodosByFilters( query )
    },
    listView() {
      this.cardViews = false
      this.listViews = true
    },
    cardView() {
      this.cardViews = true
      this.listViews = false
    }
  }
}
</script>
