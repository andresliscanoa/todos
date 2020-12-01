<template>
  <v-card flat>
    <v-toolbar flat tile>
      <v-toolbar-title>
        <span>Update password</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click.native="closeUpdatePassword">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout justify-space-around row wrap>
        <v-flex md6 px-4 xs12>
          <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              autofocus
              color="purple"
              label="Password"
              type="password"
              @blur="$v.password.$touch()"
          />
        </v-flex>
        <v-flex md6 px-4 xs12>
          <v-text-field
              v-model="confirmPassword"
              :error-messages="confirmPasswordErrors"
              color="purple"
              label="Confirm password"
              type="password"
              @focus="$v.confirmPassword.$touch()"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
          :disabled="$v.$invalid"
          :loading="loading"
          color="teal darken-2"
          text
          @click.native="update"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { minLength, maxLength, required, sameAs } from 'vuelidate/lib/validators'
import { mapMutations, mapActions }               from 'vuex'

export default {
  name       : 'UserPassword',
  props      : {
    _id: {
      type    : String,
      required: true,
      default : ''
    }
  },
  data       : () => ({
    password       : '',
    confirmPassword: '',
    loading        : false
  }),
  validations: {
    password       : {
      minLength: minLength( 6 ),
      maxLength: maxLength( 15 ),
      required
    },
    confirmPassword: {
      minLength: minLength( 6 ),
      maxLength: maxLength( 15 ),
      required,
      sameAs   : sameAs( 'password' )
    }
  },
  computed   : {
    passwordErrors() {
      let err = []
      if ( !this.$v.password.$dirty ) return err
      if ( !this.$v.password.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.password.minLength ) {
        err.push( 'Minimum six characters' )
      }
      if ( !this.$v.password.maxLength ) {
        err.push( 'Maximum 15 characters' )
      }
      return err
    },
    confirmPasswordErrors() {
      let err = []
      if ( !this.$v.confirmPassword.$dirty ) return err
      if ( !this.$v.confirmPassword.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.confirmPassword.minLength ) {
        err.push( 'Minimum six characters' )
      }
      if ( !this.$v.confirmPassword.maxLength ) {
        err.push( 'Maximum 15 characters' )
      }
      if ( !this.$v.confirmPassword.sameAs ) {
        err.push( 'Password does not match' )
      }
      return err
    }
  },
  methods    : {
    ...mapMutations( [ 'setErrorAlert' ] ),
    ...mapActions( [ 'updateUserPassword' ] ),
    async update() {
      this.loading = true
      const payload = {
        id      : this._id,
        password: this.password
      }
      await this.updateUserPassword( payload )
          .then( res => {
            this.loading = false
            if ( res.status === 200 ) {
              this.closeUpdatePassword( res.body )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    },
    closeUpdatePassword( payload ) {
      this.$emit( 'closeUpdatePassword', payload )
      this.password = ''
      this.confirmPassword = ''
      this.$v.$reset()
    }
  }
}
</script>
