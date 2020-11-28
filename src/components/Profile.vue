<template>
  <v-card>
    <v-toolbar color="blue lighten-2" dark flat tile>
      <v-toolbar-title>
        <span class="text-h4">
          Profile
        </span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
          dark
          icon
          @click.native="closeProfileSheet"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout justify-center row wrap>
        <v-flex md6 px-5 xs12>
          <v-list
              two-line
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Name</v-list-item-title>
                <v-list-item-subtitle>{{ userFulName }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Lastname</v-list-item-title>
                <v-list-item-subtitle>{{ userFulLastName }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
        <v-flex md6 pt-5 px-10 xs12>
          <v-avatar
              class="profile"
              size="180"
          >
            <v-icon color="black" size="270">mdi-account</v-icon>
          </v-avatar>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters }                            from 'vuex'

export default {
  name       : 'Profile',
  computed   : {
    ...mapGetters( [ 'getUser' ] ),
    user() {
      return this.getUser
    },
    userFulName() {
      return this.getUser.name.last !== undefined ? this.getUser.name.first + ' ' + this.getUser.name.last : this.getUser.name.first
    },
    userFulLastName() {
      return this.getUser.lastname.last !== undefined ? this.getUser.lastname.first + ' ' + this.getUser.lastname.last : this.getUser.lastname.first
    }
  },
  methods    : {
    closeProfileSheet() {
      this.$emit( 'closeProfileSheet' )
    }
  }
}
</script>
