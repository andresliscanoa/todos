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
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.name.last"
              color="purple"
              label="Second name"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.lastname.first"
              color="purple"
              label="First lastname"
          />
        </v-flex>
        <v-flex lg3 md6 px-2 xs12>
          <v-text-field
              v-model="user.lastname.last"
              color="purple"
              label="Second lastname"
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
  </v-card>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name    : 'UserViewUpdate',
  props   : {
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
  data    : () => ({
    updateUser: false,
    loading   : false
  }),
  computed: {
    ...mapGetters( [ 'getRoles' ] ),
    roles() { return this.getRoles },
    fullName() {
      const name = this.user.name.last ? this.user.name.first + ' ' + this.user.name.last : this.user.name.first
      const lastname = this.user.lastname.last ? this.user.lastname.first + ' ' + this.user.lastname.last : this.user.lastname.first
      return name + ' ' + lastname
    }
  },
  methods : {
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
