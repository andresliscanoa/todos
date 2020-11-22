<template>
  <v-layout justify-space-around row wrap>
    <v-flex mx-10 xs12>
      <v-card color="purple lighten-4" flat>
        <v-app-bar color="transparent" dark flat>
          <v-toolbar-title>
            <span class="text-h4">
              Tasks
              <v-tooltip color="purple lighten-3" right>
                <template v-slot:activator="{on}">
                  <v-btn
                      v-on="on"
                      dark
                      icon
                      @click.native="openTodoDialogCreate"
                  >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
                </template>
                <span class="text-caption">CREATE TASK</span>
              </v-tooltip>
            </span>
          </v-toolbar-title>
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
              <dash-board-card :total="totalPending" color="pink lighten-2" title="Pending"/>
            </v-flex>
            <v-flex lg3 md4 xs12>
              <dash-board-card :total="totalOverdue" color="orange" title="Overdue"/>
            </v-flex>
            <v-flex lg3 md4 xs12>
              <dash-board-card :total="totalFinished" color="teal lighten-2" title="Finished"/>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider dark/>
        <v-card-actions>
          <v-layout column wrap>
            <v-flex xs12>
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
                          label="Date to"
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
            </v-flex>
            <v-flex xs12>
              <v-layout justify-center row wrap>
                <v-layout class="px-10" justify-start row wrap>
                  <v-flex xs1>
                    <v-tooltip bottom color="purple lighten-3">
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" :color="listViews ? 'purple' : 'white'" dark icon outlined
                               @click.native="listView()">
                          <v-icon>mdi-view-list</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">LIST VIEW</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs1>
                    <v-tooltip bottom color="purple lighten-3">
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" :color="cardViews ? 'purple' : 'white'" dark icon outlined
                               @click.native="cardView()">
                          <v-icon>mdi-card-account-details</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">CARDS VIEW</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-flex xs1>
                  <v-btn dark text @click.native="filterTodos()">Search</v-btn>
                </v-flex>
                <v-flex xs1>
                  <v-btn color="red darken-4" dark text @click.native="resetFilters()">Reset</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex mx-10 pt-1 xs12>
      <v-expand-transition>
        <v-data-table
            :headers="headers"
            :item-key="this.todos._id"
            :items="this.todos"
            v-show="listViews"
            :page.sync="page"
            class="elevation-1"
            mobile-breakpoint="450"
            :items-per-page="itemsPagination"
            :loading="loading"
            hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-layout justify-space-around row>
              <v-flex xs1>
                <v-tooltip color="purple lighten-3" left>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click.native="openTodoDialogShow(item._id)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Open task</span>
                </v-tooltip>
              </v-flex>
              <v-flex class="hidden-xs-only" xs1>
                <v-tooltip color="purple lighten-3" right>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon>
                      <v-icon>mdi-autorenew</v-icon>
                    </v-btn>
                  </template>
                  <span>Update status</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </template>
          <template slot="no-data">
            <v-alert
                :value="true"
                color="purple lighten-4"
                dark
                icon="mdi-alert"
            >
              No tasks created or no data found by filters criteria...
            </v-alert>
          </template>
        </v-data-table>
      </v-expand-transition>
      <v-layout v-show="cardViews" justify-start row wrap>
        <v-flex v-for="todo in todos" :key="todo._id" lg3 md4 pt-2 px-3 sm6 xs12>
          <todo-card
              :_id="todo._id"
              :category="todo.category"
              :color="colorCard(todo)"
              :createdAt="todo.createdAt"
              :status="todo.status"
              :title="todo.title"
              :userTodo="todo.user"
              @openTodoDialogShow="openTodoDialogShow($event)"
          />
        </v-flex>
      </v-layout>
      <v-layout justify-end row wrap>
        <v-flex mt-3 xs2>
          <span class="text-caption">TOTAL ITEMS: {{ todoPagination.total }}</span>
        </v-flex>
        <v-flex mx-5 xs1>
          <v-select
              v-model="itemsPagination"
              :items="itemsPerPage"
              color="purple"
              label="Items per page"
              @change="filterTodos"
          />
        </v-flex>
      </v-layout>
      <div class="text-center pt-2">
        <v-pagination
            v-model="page"
            :length="this.todoPagination.pages"
            circle
            color="purple darken-3"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            total-visible="7"
            @input="filterTodos"
        />
      </div>
    </v-flex>
    <alert :color="colorAlert" :errors="errorsAlert" :icon="iconAlert" :info="infoAlert" :message="messageAlert"
           :status="statusAlert"/>
    <floating-button-menu/>
    <v-dialog
        v-model="todoDialog"
        hide-overlay
        max-width="40rem"
        persistent
    >
      <todo-create-update :create="todoCreate" :show="todoShow" @closeTodoDialog="closeTodoDialog"
                          @showConfirmAlert="showConfirmAlert($event)" @showErrorAlert="showErrorAlert($event)"/>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Alert                                    from '@/components/Alert'
import DashBoardCard                            from '@/components/DashBoardCard'
import FloatingButtonMenu                       from '@/components/FloatingButtonMenu'
import TodoCard                                 from '@/components/TodoCard'
import TodoCreateUpdate                         from '@/components/TodoCreateUpdate'

export default {
  name      : 'Home',
  components: {
    Alert,
    DashBoardCard,
    FloatingButtonMenu,
    TodoCard,
    TodoCreateUpdate
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
    iconAlert      : '',
    messageAlert   : '',
    statusAlert    : '',
    errorsAlert    : '' || [],
    infoAlert      : {},
    headers        : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Title', align: 'center', sortable: 'false', value: 'title' },
      { text: 'Status', align: 'center', sortable: 'false', value: 'status' },
      { text: 'User', align: 'center', sortable: 'false', value: 'user.email' },
      { text: 'Created at', align: 'center', sortable: 'true', value: 'createdAt' }
    ],
    itemsPagination: 10,
    itemsPerPage   : [ 10, 25, 50, 100 ],
    page           : 1,
    loading        : false,
    listViews      : true,
    cardViews      : false,
    todoDialog     : false,
    todoCreate     : false,
    todoShow       : false
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
    totalPending() { return this.getDashboard.pending },
    totalOverdue() { return this.getDashboard.overdue },
    totalFinished() { return this.getDashboard.finished },
    minEnd() { return this.start ? this.start : '2020-11-01' }
  },
  methods   : {
    ...mapMutations( [ 'setAlert', 'setTodo' ] ),
    ...mapActions( [ 'getTodoDashboard', 'findCategoriesByUser', 'getTodosByFilters', 'getTodoById' ] ),
    async dash() {
      await this.getTodoDashboard( this.user._id )
    },
    async filterTodos() {
      this.loading = true
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
      this.loading = false
    },
    async filterCategories() {
      const query = {
        items: 100,
        page : 1
      }
      await this.findCategoriesByUser( query )
          .then( res => {
            if ( res.status === 400 ) {
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
        page : this.page || 1,
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
    },
    colorCard( todo ) {
      return todo.status === 'Pending' ? 'pink lighten-2' : todo.status === 'Overdue' ? 'orange' : 'teal lighten-2'
    },
    showConfirmAlert( payload ) {
      this.closeTodoDialog()
      this.filterTodos()
      this.dash()
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
    },
    openTodoDialogCreate() {
      this.todoCreate = true
      this.todoDialog = true
    },
    closeTodoDialog() {
      this.todoDialog = false
      this.todoCreate = false
      this.todoShow = false
    },
    async openTodoDialogShow( payload ) {
      const find = {
        id  : payload,
        user: this.user._id
      }
      await this.getTodoById( find )
          .then( res => {
            if ( res.status === 200 ) {
              this.todoDialog = true
              this.todoShow = true
            }
          } )
    }
  }
}
</script>
