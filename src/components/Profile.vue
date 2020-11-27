<template>
  <v-card>
    <v-toolbar color="blue lighten-2" dark flat tile>
      <v-toolbar-title>
        <span class="text-h4">
          PROFILE
          <v-btn v-if="!editUser" icon @click.native="editUser = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="editUser" icon @click.native="editUser = false">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
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
      <v-layout v-if="!editUser" justify-space-around row wrap>
        <v-flex lg3 md4 pt-2 sm6 xs12>
          <span class="text-h5">Name: </span>
          <span class="text-h5">{{ userFulName }}</span>
        </v-flex>
        <v-flex lg3 md4 pt-2 sm6 xs12>
          <span class="text-h5">Lastname: </span>
          <span class="text-h5">{{ userFulLastName }}</span>
        </v-flex>
        <v-flex lg4 md4 pt-2 sm6 xs12>
          <span class="text-h5">Email: </span>
          <span class="text-h5">{{ user.email }}</span>
        </v-flex>
      </v-layout>
      <v-layout v-else justify-start row wrap>
        <v-flex md5 px-10 sm6 xs12>
          <v-text-field
              v-model="user.name.first"
              label="First name"
          />
        </v-flex>
        <v-flex md5 px-10 sm6 xs12>
          <v-text-field
              v-model="user.name.last"
              label="Second name"
          />
        </v-flex>
        <v-flex md5 px-10 sm6 xs12>
          <v-text-field
              v-model="user.lastname.first"
              label="Lastname"
          />
        </v-flex>
        <v-flex md5 px-10 sm6 xs12>
          <v-text-field
              v-model="user.lastname.last"
              label="Second lastname"
          />
        </v-flex>
        <v-flex md5 px-10 sm6 xs12>
          <v-text-field
              v-model="user.email"
              :error-messages="userEmailErrors"
              label="Email"
              @blur="$v.this.user.email.$touch()"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions v-if="editUser">
      <v-spacer/>
      <v-btn color="teal darken-2" text>SAVE</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import { mapGetters }                            from 'vuex'

export default {
  name       : 'Profile',
  data       : () => ({
    editUser: false
  }),
  validations: {
    user: {
      name    : {
        first: {
          required,
          minLength: minLength( 1 ),
          maxLength: maxLength( 50 )
        },
        last : {
          minLength: minLength( 1 ),
          maxLength: maxLength( 50 )
        }
      },
      lastname: {
        first: {
          required,
          minLength: minLength( 1 ),
          maxLength: maxLength( 50 )
        },
        last : {
          minLength: minLength( 1 ),
          maxLength: maxLength( 50 )
        }
      },
      email   : {
        required,
        minLength: minLength( 7 ),
        maxLength: maxLength( 255 ),
        email
      }
    }
  },
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
    },
    userEmailErrors() {
      let err = []
      if ( !this.$v.user.email.$dirty ) return err
      if ( !this.$v.user.email.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.user.email.minLength ) {
        err.push( 'Minimum seven characters long' )
      }
      if ( !this.$v.user.email.maxLength ) {
        err.push( 'Maximum seven characters long' )
      }
      if ( !this.$v.user.email.email ) {
        err.push( 'Not a valid email format' )
      }
      return err
    }
  },
  methods    : {
    closeProfileSheet() {
      this.$emit( 'closeProfileSheet' )
      this.editUser = false
    }
  }
}
</script>
