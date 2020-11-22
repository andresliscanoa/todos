<template>
  <v-card :color="color" dark outlined>
    <v-app-bar color="transparent" flat>
      <v-toolbar-title><span class="text-button">{{ title }}</span></v-toolbar-title>
      <v-spacer/>
      <v-btn
          dark
          icon
          @click.native="$emit('openTodoDialogShow',_id)"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-actions>
      <v-layout row wrap>
        <v-flex v-if="user.rol.name==='admin'" px-5 xs12>
          <span class="text-caption"> {{ userTodo.email }}</span>
        </v-flex>
        <v-flex px-5 xs12>
          <span class="text-caption"> {{ createdAt }}</span>
        </v-flex>
      </v-layout>
      <v-spacer/>
      <v-btn dark icon>
        <v-icon>mdi-update</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name    : 'TodoCard',
  props   : {
    color    : {
      type   : String,
      default: 'cyan'
    },
    _id      : {
      type   : String,
      default: ''
    },
    title    : {
      type   : String,
      default: ''
    },
    category : {
      type   : Object,
      default: () => {
        return {
          _id : '',
          name: ''
        }
      }
    },
    status   : {
      type   : String,
      default: 'Pending'
    },
    userTodo : {
      type   : Object,
      default: () => {
        return {
          _id  : '',
          email: ''
        }
      }
    },
    createdAt: {
      type   : String,
      default: ''
    }
  },
  computed: {
    ...mapGetters( [ 'getUser' ] ),
    user() {
      return this.getUser
    }
  }
}
</script>
