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
        <v-flex class="hidden-md-and-up" mb-3 xs12>
          <v-layout justify-center row wrap>
            <v-flex sm6 xs10>
              <v-app-bar color="transparent" flat>
                <v-toolbar-items>
                  <v-btn color="blue" text><span class="text-caption">PROFILE</span></v-btn>
                  <v-divider vertical></v-divider>
                  <v-btn color="orange" text><span class="text-caption">CATEGORIES</span></v-btn>
                  <v-divider v-if="user.rol.name === 'admin'" vertical></v-divider>
                  <v-btn v-if="user.rol.name === 'admin'" color="red" text><span class="text-caption">ADMIN</span>
                  </v-btn>
                  <v-divider vertical></v-divider>
                  <v-btn color="red darken-4" text><span class="text-caption">LOGOUT</span></v-btn>
                </v-toolbar-items>
              </v-app-bar>
            </v-flex>
          </v-layout>
        </v-flex>
        <transition>
          <router-view></router-view>
        </transition>
        <floating-button-menu v-if="user._id" class="hidden-sm-and-down"
                              @showCategoriesSheet="showCategories = true" @showProfileSheet="showProfile = true"/>
      </v-container>
    </v-main>
    <v-footer absolute app>
      <v-spacer/>
      <span class="text-button"><strong>&copy;{{ year }}</strong></span>
    </v-footer>
    <alert/>
    <v-dialog
        v-model="showProfile"
        hide-overlay
        width="35rem"
    >
      <profile @closeProfileSheet="closeProfileSheet"/>
    </v-dialog>
    <v-dialog
        v-model="showCategories"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
    >
      <categories @closeCategoriesSheet="showCategories = false"/>
    </v-dialog>
    <loader v-if="loader"/>
  </v-app>
</template>

<script>
import { mapGetters }     from 'vuex'
import Categories         from '@/views/Categories'
import FloatingButtonMenu from '@/components/FloatingButtonMenu'
import Loader             from '@/components/Loader'
import Profile            from '@/components/Profile'
import Alert              from '@/components/Alert'

export default {
  name      : 'App',
  components: {
    Alert,
    Categories,
    FloatingButtonMenu,
    Loader,
    Profile
  },
  data      : () => ({
    loader        : false,
    showCategories: false,
    showProfile   : false
  }),
  computed  : {
    ...mapGetters( [ 'getUser' ] ),
    user() { return this.getUser },
    year() { return new Date().getFullYear() }
  },
  methods   : {
    closeProfileSheet() {
      this.showProfile = false
    }
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
