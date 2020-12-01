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
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.name.last"
              color="purple"
              label="Second name"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.lastname.first"
              color="purple"
              label="Lastname"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xl3 xs12>
          <v-text-field
              v-model="user.lastname.last"
              color="purple"
              label="Surname"
          />
        </v-flex>
        <v-flex md6 px-2 xs12>
          <v-text-field
              v-model="user.email"
              color="purple"
              label="Email"
          />
        </v-flex>
        <v-flex md6 px-2 xs12>
          <v-text-field
              v-model="user.password"
              color="purple"
              label="Password"
              type="password"
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
      <v-btn color="teal darken-2" text @click.native="createUsers(user)">CREATE</v-btn>
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
          maxLength: maxLength( 255 )
        },
        last : {
          maxLength: maxLength( 255 )
        }
      },
      lastname: {
        first: {
          required,
          minLength: minLength( 2 ),
          maxLength: maxLength( 255 )
        },
        last : {
          maxLength: maxLength( 255 )
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
    ...mapActions( [ 'createUser' ] ),
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
