<template>
  <v-layout class=" justify-start justify-sm-center" row wrap>
    <v-flex sm6 xs10 xs12>
      <v-app-bar color="transparent" flat>
        <v-toolbar-items>
          <v-btn color="purple" text @click.native="$router.push('/')"><span class="text-caption">TASK</span></v-btn>
          <v-divider vertical></v-divider>
          <v-btn color="orange" text @click.native="$emit('showCategoriesSheet')"><span
              class="text-caption">CATEGORIES</span></v-btn>
          <v-divider v-if="rol === 'admin'" vertical></v-divider>
          <v-btn color="blue" text @click.native="$emit('showProfileSheet')"><span class="text-caption">PROFILE</span>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn v-if="rol === 'admin'" color="red" text @click.native="$router.push('/admin')"><span
              class="text-caption">ADMIN</span>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn color="red darken-4" text @click.native="closeSession"><span class="text-caption">LOGOUT</span></v-btn>
        </v-toolbar-items>
      </v-app-bar>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name    : 'MobileMenu',
  computed: {
    ...mapGetters( [ 'getUser' ] ),
    rol() {
      return this.getUser.rol.name
    }
  },
  methods : {
    ...mapActions( [ 'logOut' ] ),
    closeSession() {
      this.logOut()
      this.$router.push( '/singIn' )
    }
  }
}
</script>
