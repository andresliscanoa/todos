<template>
  <v-speed-dial
      v-model="menu"
      absolute
      direction="bottom"
      right
      top
      transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
          v-model="menu"
          color="purple darken-2"
          dark
          fab
      >
        <v-icon v-if="menu">
          mdi-chevron-triple-up
        </v-icon>
        <v-icon v-else>
          mdi-chevron-triple-down
        </v-icon>
      </v-btn>
    </template>
    <v-tooltip color="blue lighten-2" left>
      <template v-slot:activator="{on}">
        <v-btn
            v-on="on"
            color="purple"
            dark
            fab
            small
            @click.native="$router.push('/')"
        >
          <v-icon>mdi-calendar-check</v-icon>
        </v-btn>
      </template>
      <span class="text-caption">TASK</span>
    </v-tooltip>
    <v-tooltip color="orange lighten-2" left>
      <template v-slot:activator="{on}">
        <v-btn
            v-on="on"
            color="orange"
            dark
            fab
            small
            @click.native="$emit('showCategoriesSheet')"
        >
          <v-icon>mdi-book-variant</v-icon>
        </v-btn>
      </template>
      <span class="text-caption">CATEGORIES</span>
    </v-tooltip>
    <v-tooltip color="blue lighten-2" left>
      <template v-slot:activator="{on}">
        <v-btn
            v-on="on"
            color="blue"
            dark
            fab
            small
            @click.native="$emit('showProfileSheet')"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <span class="text-caption">PROFILE</span>
    </v-tooltip>
    <v-tooltip v-if="rol === 'admin'" color="red lighten-2" left>
      <template v-slot:activator="{on}">
        <v-btn
            v-on="on"
            color="deep-orange"
            dark
            fab
            small
            @click.native="$router.push('/admin')"
        >
          <v-icon>mdi-account-hard-hat</v-icon>
        </v-btn>
      </template>
      <span class="text-caption">ADMIN</span>
    </v-tooltip>
    <v-tooltip color="red darken-4" left>
      <template v-slot:activator="{on}">
        <v-btn
            v-on="on"
            color="black"
            dark
            fab
            small
            @click.native="closeSession"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <span class="text-caption">LOGOUT</span>
    </v-tooltip>
  </v-speed-dial>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name    : 'FloatingButtonMenu',
  data    : () => ({
    menu: false
  }),
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
