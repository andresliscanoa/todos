<template>
  <v-card flat>
    <v-toolbar flat tile>
      <v-toolbar-title>
        <span v-if="!updateUser">
          {{ fullName }}
          <v-btn icon @click.native="updateUser = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </span>
        <span v-else>
          Update user
          <v-btn :loading="loading" icon @click.native="saveUpdateUser">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click.native="closeShowUser">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout v-if="!updateUser" justify-center row wrap>
        <v-flex md6 xs12>
          <v-list
              two-line
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Rol</v-list-item-title>
                <v-list-item-subtitle>{{ user.rol.name }}</v-list-item-subtitle>
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
      <v-layout v-else justify-space-around row wrap>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.name.first"
              color="purple"
              label="First name"
              :error-messages="firstNameErrors"
              @blur="$v.user.name.first.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.name.last"
              color="purple"
              label="Second name"
              :error-messages="lastNameErrors"
              @blur="$v.user.name.last.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.lastname.first"
              color="purple"
              label="First lastname"
              :error-messages="firstLastnameErrors"
              @blur="$v.user.lastname.first.$touch()"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.lastname.last"
              color="purple"
              label="Second lastname"
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
  </v-card>
</template>
<script>
import { mapGetters, mapMutations, mapActions }  from 'vuex'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name       : 'UserViewUpdate',
  props      : {
    user: {
      type    : Object,
      required: true,
      default : () => {
        return {
          _id     : '',
          name    : {
            first: '',
            last : ''
          },
          lastname: {
            first: '',
            last : ''
          },
          email   : '',
          rol     : {
            _id : '',
            name: ''
          }
        }
      }
    }
  },
  data       : () => ({
    updateUser: false,
    loading   : false
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
        email
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
    fullName() {
      const name = this.user.name.last ? this.user.name.first + ' ' + this.user.name.last : this.user.name.first
      const lastname = this.user.lastname.last ? this.user.lastname.first + ' ' + this.user.lastname.last : this.user.lastname.first
      return name + ' ' + lastname
    },
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
    ...mapActions( [ 'updateUserById' ] ),
    async saveUpdateUser() {
      this.loading = true
      const payload = {
        id  : this.user._id,
        user: {
          name    : {
            first: this.user.name.first,
            last : this.user.name.last
          },
          lastname: {
            first: this.user.lastname.first,
            last : this.user.lastname.last
          },
          email   : this.user.email,
          rol     : this.user.rol._id
        }
      }
      await this.updateUserById( payload )
          .then( res => {
            this.loading = false
            if ( res.status === 200 ) {
              this.closeShowUser( res.body )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
          } )
    },
    closeShowUser( payload ) {
      this.$emit( 'closeShowUser', payload )
      this.user = {
        _id     : '',
        name    : {
          first: '',
          last : ''
        },
        lastname: {
          first: '',
          last : ''
        },
        email   : '',
        rol     : {
          _id : '',
          name: ''
        }
      }
    }
  }
}
</script>
