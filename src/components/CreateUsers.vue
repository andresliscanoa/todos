<template>
  <v-card flat>
    <v-toolbar flat tile>
      <v-toolbar-title>
        <span>Create User</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click.native="closeCreateUser">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout justify-start row wrap>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.name.first"
              autofocus
              color="purple"
              label="First name"
              :error-messages="firstNameErrors"
              @blur="$v.user.name.first.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.name.last"
              color="purple"
              label="Second name"
              :error-messages="lastNameErrors"
              @blur="$v.user.name.last.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.lastname.first"
              color="purple"
              label="Lastname"
              :error-messages="firstLastnameErrors"
              @blur="$v.user.lastname.first.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.lastname.last"
              color="purple"
              label="Surname"
              :error-messages="lastLastnameErrors"
              @blur="$v.user.lastname.last.$touch()"
          />
        </v-flex>
        <v-flex md6 px-2 xs12>
          <v-text-field
              v-model="user.email"
              color="purple"
              label="Email"
              :error-messages="emailErrors"
              @blur="$v.user.email.$touch()"
          />
        </v-flex>
        <v-flex md6 px-2 xs12>
          <v-text-field
              v-model="user.password"
              color="purple"
              label="Password"
              type="password"
              :error-messages="passwordErrors"
              @blur="$v.user.password.$touch()"
          />
        </v-flex>
        <v-flex md6 px-2 xs12>
          <v-select
              v-model="user.rol"
              :items="roles"
              color="purple"
              item-text="name"
              item-value="_id"
              label="Rol"
              return-object
              :error-messages="rolErrors"
              @blur="$v.user.rol.$touch()"
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
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :disabled="$v.user.$invalid" color="teal darken-2" text @click.native="createUsers(user)">CREATE</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapMutations, mapActions }  from 'vuex'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name       : 'CreateUser',
  data       : () => ({
    user: {
      name    : {
        first: '',
        last : ''
      },
      lastname: {
        first: '',
        last : ''
      },
      email   : '',
      password: '',
      rol     : {
        _id : '',
        name: ''
      }
    }
  }),
  validations: {
    user: {
      name    : {
        first: {
          required,
          minLength: minLength( 2 ),
          maxLength: maxLength( 50 )
        },
        last : {
          maxLength: maxLength( 50 )
        }
      },
      lastname: {
        first: {
          required,
          minLength: minLength( 2 ),
          maxLength: maxLength( 50 )
        },
        last : {
          maxLength: maxLength( 50 )
        }
      },
      email   : {
        required,
        minLength: minLength( 7 ),
        maxLength: maxLength( 150 ),
        email,
        async isUnique( value ) {
          if ( value === '' ) return true
          const res = await this.uniqueUserEmail( value )
          return !!(await res.status === 200 && res.body.message === 'Available value')
        }
      },
      password: {
        required,
        minLength: minLength( 6 ),
        maxLength: maxLength( 15 )
      },
      rol     : {
        name: {
          required,
          mustBe( value ) {
            return [ 'admin', 'users' ].indexOf( value ) >= 0
          }
        }
      }
    }
  },
  computed   : {
    ...mapGetters( [ 'getRoles' ] ),
    roles() { return this.getRoles },
    firstNameErrors() {
      let err = []
      if ( !this.$v.user.name.first.$dirty ) return err
      if ( !this.$v.user.name.first.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.user.name.first.minLength ) {
        err.push( 'Minimum two characters' )
      }
      if ( !this.$v.user.name.first.maxLength ) {
        err.push( 'Maximum 50 characters' )
      }
      return err
    },
    lastNameErrors() {
      let err = []
      if ( !this.$v.user.name.last.$dirty ) return err
      if ( !this.$v.user.name.last.maxLength ) {
        err.push( 'Maximum 50 characters' )
      }
      return err
    },
    firstLastnameErrors() {
      let err = []
      if ( !this.$v.user.lastname.first.$dirty ) return err
      if ( !this.$v.user.lastname.first.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.user.lastname.first.minLength ) {
        err.push( 'Minimum two characters' )
      }
      if ( !this.$v.user.lastname.first.maxLength ) {
        err.push( 'Maximum 50 characters' )
      }
      return err
    },
    lastLastnameErrors() {
      let err = []
      if ( !this.$v.user.lastname.last.$dirty ) return err
      if ( !this.$v.user.lastname.last.maxLength ) {
        err.push( 'Maximum 50 characters' )
      }
      return err
    },
    emailErrors() {
      let err = []
      if ( !this.$v.user.email.$dirty ) return err
      if ( !this.$v.user.email.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.user.email.minLength ) {
        err.push( 'Minimum seven characters' )
      }
      if ( !this.$v.user.email.maxLength ) {
        err.push( 'Maximum 150 characters' )
      }
      if ( !this.$v.user.email.email ) {
        err.push( 'Not a valid email format' )
      }
      if ( !this.$v.user.email.isUnique ) {
        err.push( 'Email already exists' )
      }
      return err
    },
    passwordErrors() {
      let err = []
      if ( !this.$v.user.password.$dirty ) return err
      if ( !this.$v.user.password.minLength ) {
        err.push( 'Minimum six characters' )
      }
      if ( !this.$v.user.password.maxLength ) {
        err.push( 'Maximum 15 characters' )
      }
      return err
    },
    rolErrors() {
      let err = []
      if ( !this.$v.user.rol.$dirty ) return err
      if ( !this.$v.user.rol.name.required ) {
        err.push( 'Mandatory field' )
      }
      if ( !this.$v.user.rol.name.mustBe ) {
        err.push( 'Invalid value' )
      }
      return err
    }
  },
  methods    : {
    ...mapMutations( [ 'setErrorAlert' ] ),
    ...mapActions( [ 'createUser', 'uniqueUserEmail' ] ),
    async createUsers( payload ) {
      payload.rol = payload.rol._id
      await this.createUser( payload )
          .then( res => {
            if ( res.status === 200 ) {
              this.closeCreateUser( res.body )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    },
    closeCreateUser( payload ) {
      this.user = {
        name    : {
          first: '',
          last : ''
        },
        lastname: {
          first: '',
          last : ''
        },
        email   : '',
        password: '',
        rol     : {
          _id : '',
          name: ''
        }
      }
      this.$emit( 'closeCreateUser', payload )
    }
  }
}
</script>
