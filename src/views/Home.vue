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
            <v-flex lg2 md4 xs12>
              <dash-board-card :total="totalPending" color="pink lighten-2" title="Pending"/>
            </v-flex>
            <v-flex lg2 md4 xs12>
              <dash-board-card :total="totalOverdue" color="orange" title="Overdue"/>
            </v-flex>
            <v-flex lg2 md4 xs12>
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
                <v-flex v-if="user.rol.name==='admin'" md3 px-2 xs12>
                  <v-select
                      v-model="userF"
                      :items="users"
                      dark
                      item-text="email"
                      item-value="_id"
                      label="User"
                      return-object
                  >
                    <template
                        slot="selection"
                        slot-scope="data">
                      {{ data.item.email }}
                    </template>
                    <template
                        slot="item"
                        slot-scope="data">
                      {{ data.item.email }}
                    </template>
                  </v-select>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout justify-center row wrap>
                <v-layout class="px-5" justify-start row wrap>
                  <v-flex md1 sm2 xs5>
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
                  <v-flex md1 sm2 xs5>
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
                  <v-flex md1 sm2 xs5>
                    <v-tooltip bottom color="purple lighten-3">
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" :color="calendarViews ? 'purple' : 'white'" dark icon outlined
                               @click.native="calendarView()">
                          <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">CALENDAR VIEW</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-flex lg1 md2 sm2 xs3>
                  <v-btn dark text @click.native="filterTodos()">Search</v-btn>
                </v-flex>
                <v-flex lg1 md2 sm2 xs3>
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
            <v-layout class="px-5" justify-space-around row>
              <v-flex v-if="item.status!=='Finished'" class="hidden-xs-only" md2 sm4 xs1>
                <v-checkbox
                    :key="item._id"
                    v-model="item.selected"
                    :loading="updateLoading"
                    @click.native="setStatusTodo(item._id)"
                />
              </v-flex>
              <v-flex md2 pt-3 sm4 xs1>
                <v-tooltip color="purple lighten-3" left>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="blue" icon @click.native="openTodoDialogShow(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Open task</span>
                </v-tooltip>
              </v-flex>
              <v-flex md2 pt-3 sm4 xs1>
                <v-tooltip color="purple lighten-3" right>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" :loading="deleteLoading" color="red darken-4" icon
                           @click.native="deleteTodo(item._id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete task</span>
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
              @deleteTodo="deleteTodo($event)"
          />
        </v-flex>
      </v-layout>
      <v-flex v-show="calendarViews" xs12>
        <todo-calendar/>
      </v-flex>
      <v-flex v-show="!calendarViews" xs12>
        <v-layout justify-end row wrap>
          <v-flex lg2 mt-3 sm2 xs4>
            <span class="text-caption">TOTAL ITEMS: {{ todoPagination.total }}</span>
          </v-flex>
          <v-flex lg1 mx-5 sm2 xs4>
            <v-select
                v-model="itemsPagination"
                :items="itemsPerPage"
                color="purple"
                label="Items per page"
                @change="filterTodos(true)"
            />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-show="!calendarViews" class="text-center pt-2" sx12>
        <v-pagination
            v-model="page"
            :length="this.todoPagination.pages"
            circle
            color="purple darken-3"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            total-visible="7"
            @input="filterTodos(false)"
        />
      </v-flex>
    </v-flex>
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
import DashBoardCard                            from '@/components/DashBoardCard'
import TodoCalendar                             from '@/components/TodoCalendar'
import TodoCard                                 from '@/components/TodoCard'
import TodoCreateUpdate                         from '@/components/TodoCreateUpdate'

export default {
  name      : 'Home',
  components: {
    DashBoardCard,
    TodoCalendar,
    TodoCard,
    TodoCreateUpdate
  },
  data      : () => ({
    showDash       : true,
    todoCheck      : false,
    category       : {},
    userF          : {},
    status         : '',
    start          : '',
    menuStart      : false,
    end            : '',
    menuEnd        : false,
    itemStatus     : [ 'Pending', 'Overdue', 'Finished' ],
    headersAdmin   : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Title', align: 'left', sortable: 'false', value: 'title' },
      { text: 'Status', align: 'center', sortable: 'false', value: 'status' },
      { text: 'User', align: 'center', sortable: 'false', value: 'user.email' },
      { text: 'Created at', align: 'center', sortable: 'true', value: 'createdAt' }
    ],
    headersUser    : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Title', align: 'left', sortable: 'false', value: 'title' },
      { text: 'Status', align: 'center', sortable: 'false', value: 'status' },
      { text: 'Created at', align: 'center', sortable: 'true', value: 'createdAt' }
    ],
    itemsPagination: 10,
    itemsPerPage   : [ 10, 25, 50, 100 ],
    page           : 1,
    loading        : false,
    deleteLoading  : false,
    updateLoading  : false,
    listViews      : true,
    cardViews      : false,
    calendarViews  : false,
    todoDialog     : false,
    todoCreate     : false,
    todoShow       : false
  }),
  async created() {
    await this.dash()
        .then( res => {
          if ( res.status === 200 ) {
            this.filterTodos( true )
            this.filterCategories()
            this.usersFilter()
          }
        } )
  },
  computed  : {
    ...mapGetters( [ 'getUser', 'getDashboard', 'getCategoriesFilter', 'getTodos', 'getTodoPagination', 'getUsers' ] ),
    user() { return this.getUser },
    users() { return this.getUsers },
    headers() { return this.user.rol.name === 'admin' ? this.headersAdmin : this.headersUser },
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
    ...mapMutations( [ 'setConfirmAlert', 'setErrorAlert', 'setAlertOff', 'setTodo', 'starting' ] ),
    ...mapActions( [ 'getTodoDashboard', 'findCategoriesByUser', 'getTodosByFilters', 'getTodoById', 'updateTodosStatus', 'deleteTodos', 'findUsers' ] ),
    async dash() {
      await this.getTodoDashboard( this.user._id )
    },
    async usersFilter() {
      const query = {
        items: 100,
        page : 1
      }
      await this.findUsers( query )
    },
    async filterTodos( value ) {
      this.loading = true
      const query = {
        items   : this.itemsPagination || 10,
        page    : value ? 1 : this.page,
        category: this.category._id || null,
        status  : this.status || null,
        user    : this.userF._id ? this.userF._id : this.user.rol.name === 'admin' ? null : this.user._id,
        start   : this.start || null,
        end     : this.end || null
      }
      await this.getTodosByFilters( query )
      this.loading = false
    },
    async filterCategories() {
      const query = {
        items: 10,
        page : 1
      }
      await this.findCategoriesByUser( query )
          .then( res => {
            if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    },
    async resetFilters() {
      this.start = ''
      this.end = ''
      this.category = {}
      this.status = ''
      this.userF = {}
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
      this.calendarViews = false
    },
    cardView() {
      this.cardViews = true
      this.listViews = false
      this.calendarViews = false
    },
    calendarView() {
      this.cardViews = false
      this.listViews = false
      this.calendarViews = true
    },
    colorCard( todo ) {
      return todo.status === 'Pending' ? 'pink lighten-2' : todo.status === 'Overdue' ? 'orange' : 'teal lighten-2'
    },
    showConfirmAlert( payload ) {
      this.closeTodoDialog()
      this.filterTodos()
      this.dash()
      this.setConfirmAlert( payload )
      setTimeout( () => this.setAlertOff(), 4000 )
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
      this.loader = true
      const find = {
        id  : payload._id,
        user: payload.user._id
      }
      await this.getTodoById( find )
          .then( res => {
            this.loader = false
            if ( res.status === 200 ) {
              this.todoDialog = true
              this.todoShow = true
            }
          } )
    },
    async setStatusTodo( id ) {
      const payload = {
        id,
        status: 'Finished'
      }
      this.updateLoading = true
      await this.updateTodosStatus( payload )
          .then( res => {
            this.updateLoading = false
            if ( res.status === 200 ) {
              this.showConfirmAlert( res.body )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    },
    async deleteTodo( payload ) {
      this.deleteLoading = true
      const todo = { id: payload }
      await this.deleteTodos( todo )
          .then( res => {
            this.deleteLoading = false
            if ( res.status === 200 ) {
              this.showConfirmAlert( res.body )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    }
  }
}
</script>
