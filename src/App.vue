<template>
  <v-app>
    <v-app-bar
        app
        color="amber"
        dark
    >
      <v-spacer/>
      <v-btn
          href="https://github.com/andresliscanoa/todos"
          target="_blank"
          text
      >
        <span class="mr-2">andresliscanoa</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <transition>
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <v-footer absolute app>
      <v-spacer/>
      <span class="text-button"><strong>&copy;{{ year }}</strong></span>
    </v-footer>
    <alert/>
  </v-app>
</template>

<script>
import Alert from '@/components/Alert'
export default {
  name      : 'App',
  components: {
    Alert
  },
  computed  : {
    year() { return new Date().getFullYear() }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>
