<template>
  <v-layout justify-space-around row wrap>
    <alert :color="colorAlert" :errors="errorsAlert" :icon="iconAlert" :info="infoAlert" :message="messageAlert"
           :status="statusAlert"/>
    <v-flex lg5 mt-10 pt-10 sm6 xl3 xs12>
      <v-card class="white--text gradient" elevation="10" height="30rem" outlined>
        <v-card-text>
          <v-layout class="pt-16 mt-10" justify-center row wrap>
            <v-flex xs11>
              <v-text-field
                  v-model="email"
                  :error-messages="errorsEmail"
                  autofocus
                  dark
                  placeholder="Enter your email"
                  prepend-icon="mdi-at"
                  title="Email"
                  @blur="$v.email.$touch()"
                  @keydown.space.prevent
              />
            </v-flex>
            <v-flex xs11>
              <v-text-field
                  v-model="password"
                  :error-messages="errorsPassword"
                  dark
                  maxLength="20"
                  placeholder="Enter your password"
                  prepend-icon="mdi-lock"
                  title="Password"
                  type="password"
                  @blur="$v.password.$touch()"
                  @keydown.space.prevent
                  @keyup.enter="login"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center row wrap>
            <v-flex xs3>
              <v-btn
                  :class="{ 'button-disable': disabled }"
                  :loading="loading"
                  dark
                  text
                  x-large
                  @click.native="login"
              >
                Sing In
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex class="hidden-sm-and-down" md6 pt-16>
      <v-img
          contain
          max-height="35rem"
          src="@/assets/login.png"
      ></v-img>
    </v-flex>
  </v-layout>
</template>
<script>
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import { mapGetters, mapMutations, mapActions }  from 'vuex'

const Alert = () => import( '@/components/Alert' )

export default {
  name       : 'Login',
  components : {
    Alert
  },
  data       : () => ({
    email       : '',
    password    : '',
    loading     : false,
    colorAlert  : '',
    iconAlert   : '',
    messageAlert: '',
    statusAlert : '',
    errorsAlert : '' || [],
    infoAlert   : {}
  }),
  validations: {
    email   : {
      required,
      minLength: minLength( 7 ),
      maxLength: maxLength( 100 ),
      email
    },
    password: {
      required,
      minLength: minLength( 6 ),
      maxLength: maxLength( 20 )
    }
  },
  computed   : {
    ...mapGetters( [ 'getAlert' ] ),
    alert() {
      return this.getAlert
    },
    disabled() {
      if ( this.$v.email.$invalid || this.$v.password.$invalid ) {
        return true
      }
      return !(!this.$v.email.$invalid && !this.$v.password.$invalid)
    },
    errorsEmail() {
      let err = []
      if ( !this.$v.email.$dirty ) return err
      if ( !this.$v.email.required ) {
        err.push( 'This field is required' )
      }
      if ( !this.$v.email.minLength ) {
        err.push( 'Minimum six characters' )
      }
      if ( !this.$v.email.maxLength ) {
        err.push( 'Maximum 100 characters' )
      }
      if ( !this.$v.email.email ) {
        err.push( 'Not a valid email format' )
      }
      return err
    },
    errorsPassword() {
      let err = []
      if ( !this.$v.password.$dirty ) return err
      if ( !this.$v.password.required ) {
        err.push( 'This field is required' )
      }
      if ( !this.$v.password.minLength ) {
        err.push( 'Minimum six characters' )
      }
      if ( !this.$v.password.maxLength ) {
        err.push( 'Maximum 20 characters' )
      }
      return err
    }
  },
  methods    : {
    ...mapMutations( [ 'setAlert', 'setUser' ] ),
    ...mapActions( [ 'singIn' ] ),
    async login() {
      if ( !this.disabled ) {
        this.loading = true
        const user = {
          email   : this.email,
          password: this.password
        }
        await this.singIn( user )
            .then( res => {
              this.loading = false
              if ( res.status === 200 ) {
                this.$router.push( '/' )
              } else if ( res.status === 400 ) {
                this.setAlert( true )
                this.colorAlert = 'red'
                this.iconAlert = 'mdi-alert'
                this.statusAlert = res.body.status
                this.messageAlert = res.body.message
                this.errorsAlert = res.body.response && res.body.response.err || null
                this.infoAlert = res.body.response && res.body.response.info || null
              }
            } )
      }
    }
  }
}
</script>
<style scoped>
.button-disable {
  pointer-events: none;
  opacity: 0.7;
}

.gradient {
  background-image: linear-gradient(rgba(90, 40, 224, 1), rgba(255, 193, 7, 0.6));
}
</style>
