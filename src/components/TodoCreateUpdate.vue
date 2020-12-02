<template>
  <v-card color="purple lighten-4" flat>
    <v-app-bar color="transparent" flat>
      <v-toolbar-title>
        <span v-if="show&&!updateTodo" class="text--button">
          {{ todo.title.charAt( 0 ).toUpperCase() + todo.title.slice( 1 ) }}
        </span>
        <span v-if="updateTodo" class="text--button">
          Update Todo
        </span>
        <v-btn
            v-if="show&&!updateTodo"
            color="orange"
            dark
            icon
            small
            @click.native="updateTodo = true"
        >
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
            v-if="updateTodo"
            :loading="updateLoading"
            color="purple"
            dark
            icon
            small
            @click.native="updateTodosById(todo)"
        >
          <v-icon dark>mdi-content-save</v-icon>
        </v-btn>
        <span v-if="create" class="text--button">Create todo</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
          color="red darken-4"
          icon
          @click.native="closeTodoDialog"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-layout justify-center row wrap>
        <v-flex v-if="create||updateTodo" md5 pt-2 px-2 xs12>
          <v-text-field
              v-model="todo.title"
              color="purple"
              label="Title"
              :error-messages="titleErrors"
              @blur="$v.todo.title.$touch"
          />
        </v-flex>
        <v-flex v-if="create||updateTodo" md7 pt-2 px-2 xs12>
          <v-text-field
              v-model="todo.description"
              color="purple"
              label="Description"
              :error-messages="descriptionErrors"
              @blur="$v.todo.description.$touch"
          />
        </v-flex>
        <v-flex v-if="show&&!updateTodo" pt-2 px-2 xs12>
          <v-text-field
              v-model="todo.description"
              :disabled="show&&!updateTodo"
              color="purple"
              label="Description"
          />
        </v-flex>
        <v-flex md6 pt-2 px-2 xs12>
          <v-select
              v-model="todo.category"
              :disabled="show&&!updateTodo"
              :items="categoriesFilter"
              color="purple"
              item-text="name"
              item-value="_id"
              label="Category"
              return-object
              :error-messages="categoryErrors"
              @blur="$v.todo.category.$touch"
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
        <v-flex md6 pt-2 px-2 xs12>
          <v-select
              v-model="todo.status"
              :disabled="show&&!updateTodo"
              :items="itemStatus"
              color="purple"
              label="Status"
              :error-messages="statusErrors"
              @blur="$v.todo.status.$touch"
          />
        </v-flex>
        <v-flex md6 pt-2 px-2 xs12>
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
                  v-model="todo.start"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="show&&!updateTodo"
                  color="purple"
                  label="From"
                  prepend-icon="mdi-calendar"
                  readonly
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="todo.start"
                :min="`${new Date().toISOString().substr(0,10)}`"
                color="purple"
                @input="menuStart = false"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex md6 pt-2 px-2 xs12>
          <v-menu
              v-model="menuDeadline"
              :close-on-content-click="false"
              :nudge-right="40"
              min-width="290px"
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="todo.deadline"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="show&&!updateTodo"
                  color="purple"
                  label="To"
                  prepend-icon="mdi-calendar"
                  readonly
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="todo.deadline"
                :min="minDeadline"
                color="purple"
                @input="menuDeadline = false"
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-flex v-if="create" px-1 xs12>
        <v-layout justify-end row wrap>
          <v-btn
              :loading="createLoading"
              color="teal"
              large
              text
              @click.native="createTodos(todo)"
              :disabled="$v.todo.$invalid"
          >
            <span class="text-button">CREATE</span>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex v-if="this.user.rol.name === 'admin'&&show" md6 px-2 xs12>
        <span class="text-caption blue-grey--text">User: {{ todo.user.email }}</span>
      </v-flex>
      <v-spacer/>
      <span v-if="show" class="text-caption blue-grey--text px-2">Created at: {{
          todo.createdAt.replace( 'T', ' ' ).substr( 0, 19 )
        }}</span>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required, maxLength }                  from 'vuelidate/lib/validators'

export default {
  name       : 'TodoCreateUpdate',
  props      : {
    show  : {
      type   : Boolean,
      default: false
    },
    create: {
      type   : Boolean,
      default: false
    }
  },
  data       : () => ({
    createLoading: false,
    updateLoading: false,
    updateTodo   : false,
    itemStatus   : [ 'Pending', 'Overdue', 'Finished' ],
    menuStart    : false,
    menuDeadline : false
  }),
  validations: {
    todo: {
      title      : {
        required,
        maxLength: maxLength( 255 )
      },
      description: {
        maxLength: maxLength( 255 )
      },
      category   : {
        required
      },
      status     : {
        required,
        mustBe( value ) {
          return [ 'Pending', 'Overdue', 'Finished' ].indexOf( value ) >= 0
        }
      }
    }
  },
  computed   : {
    ...mapGetters( [ 'getCategoriesFilter', 'getUser', 'getTodo' ] ),
    categoriesFilter() { return this.getCategoriesFilter.filter( item => item.status === true ) },
    minDeadline() {
      return this.todo.start ? this.todo.start : '2020-11-01'
    },
    user() {
      return this.getUser
    },
    todo() { return this.getTodo },
    titleErrors() {
      let err = []
      if ( !this.$v.todo.title.$dirty ) return err
      if ( !this.$v.todo.title.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.todo.title.maxLength ) {
        err.push( 'Maximun 255 characters' )
      }
      return err
    },
    descriptionErrors() {
      let err = []
      if ( !this.$v.todo.description.$dirty ) return err
      if ( !this.$v.todo.description.maxLength ) {
        err.push( 'Maximun 255 characters' )
      }
      return err
    },
    categoryErrors() {
      let err = []
      if ( !this.$v.todo.category.$dirty ) return err
      if ( !this.$v.todo.category.required ) {
        err.push( 'Mandatory field' )
      }
      return err
    },
    statusErrors() {
      let err = []
      if ( !this.$v.todo.status.$dirty ) return err
      if ( !this.$v.todo.status.$dirty ) return err
      if ( !this.$v.todo.status.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.todo.status.mustBe ) {
        err.push( 'Value not allowed' )
      }
      return err
    }
  },
  methods    : {
    ...mapMutations( [ 'setTodo' ] ),
    ...mapActions( [ 'createTodo', 'updateTodos' ] ),
    async createTodos( payload ) {
      this.createLoading = true
      const todoCreate = {
        title      : payload.title,
        description: payload.description,
        category   : payload.category._id,
        start      : payload.start,
        deadline   : payload.deadline,
        status     : payload.status
      }
      await this.createTodo( todoCreate )
          .then( res => {
            this.createLoading = false
            if ( res.status === 200 ) {
              this.$emit( 'showConfirmAlert', res.body )
              this.closeTodoDialog()
            } else if ( res.status === 400 ) {
              this.$emit( 'showErrorAlert', res.body )
            }
          } )
    },
    async updateTodosById( payload ) {
      this.updateLoading = true
      const todoUpdate = {
        id         : payload._id,
        title      : payload.title,
        description: payload.description,
        category   : payload.category._id,
        start      : payload.start,
        deadline   : payload.deadline,
        status     : payload.status
      }
      await this.updateTodos( todoUpdate )
          .then( res => {
            this.updateLoading = false
            if ( res.status === 200 ) {
              this.$emit( 'showConfirmAlert', res.body )
              this.setTodo( {} )
              this.closeTodoDialog()
            } else if ( res.status === 400 ) {
              this.$emit( 'showErrorAlert', res.body )
            }
          } )
    },
    closeTodoDialog() {
      this.setTodo( {
        _id        : '',
        title      : '',
        description: '',
        category   : {},
        start      : '',
        deadline   : '',
        status     : 'Pending',
        user       : {},
        createdAt  : ''
      } )
      this.updateTodo = false
      this.$emit( 'closeTodoDialog' )
    }
  }
}
</script>
