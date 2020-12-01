<template>
  <v-layout justify-center row wap>
    <v-flex xs12>
      <v-card flat>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer/>
          <v-btn fab large @click.native="showCreateUser = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
              :headers="headers"
              :item-key="this.users._id"
              :items="this.users"
              :items-per-page="itemsPagination"
              :loading="loading"
              :page.sync="page"
              class="elevation-1"
              hide-default-footer
              mobile-breakpoint="450"
          >
            <template v-slot:item.actions="{ item }">
              <v-layout class="px-5" justify-space-around row>
                <v-flex md2 pt-3 sm4 xs1>
                  <v-tooltip bottom color="purple lighten-3">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" color="red darken-4" icon @click.native="updatePwd(item._id)">
                        <v-icon>mdi-lock</v-icon>
                      </v-btn>
                    </template>
                    <span>Update password</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md2 pt-3 sm4 xs1>
                  <v-tooltip bottom color="purple lighten-3">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" :loading="loadingUser" color="blue" icon @click.native="openShowUser(item._id)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>See user</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </template>
            <template v-slot:item.rol.name="items">
              <v-edit-dialog
                  :return-value.sync="items.item.rol"
                  @save="save(items.item)"
              >
                {{ items.item.rol.name }}
                <template v-slot:input>
                  <v-select
                      v-model="items.item.rol"
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
                </template>
              </v-edit-dialog>
            </template>
            <template slot="no-data">
              <v-alert
                  :value="true"
                  color="purple lighten-4"
                  dark
                  icon="mdi-alert"
              >
                No users created or no data found...
              </v-alert>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-layout justify-end row wrap>
      <v-flex lg2 mt-3 sm2 xs4>
        <span class="text-caption">TOTAL ITEMS: {{ pagination.total }}</span>
      </v-flex>
      <v-flex lg1 mx-5 sm2 xs4>
        <v-select
            v-model="itemsPagination"
            :items="itemsPerPage"
            color="purple"
            label="Items per page"
            @change="getAllUsers(true)"
        />
      </v-flex>
      <v-flex pt-2 px-5 xs12>
        <v-pagination
            v-model="page"
            :length="this.pagination.pages"
            circle
            color="purple darken-3"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            total-visible="7"
            @input="getAllUsers(false)"
        />
      </v-flex>
    </v-layout>
    <v-dialog
        v-model="showCreateUser"
        hide-overlay
        persistent
        width="40rem"
    >
      <create-users @closeCreateUser="closeCreateUser($event)"/>
    </v-dialog>
    <v-dialog
        v-model="showUser"
        hide-overlay
        persistent
        width="40rem"
    >
      <user-view-update :user="user" @closeShowUser="closeShowUser($event)"/>
    </v-dialog>
    <v-dialog
        v-model="showUpdatePassword"
        hide-overlay
        persistent
        width="25rem"
    >
      <user-password :_id="idUser" @closeUpdatePassword="closeUpdatePassword($event)"/>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import CreateUsers                              from '@/components/CreateUsers'
import UserPassword                             from '@/components/UserPassword'
import UserViewUpdate                           from '@/components/UserViewUpdate'

export default {
  name      : 'Admin',
  components: { CreateUsers, UserPassword, UserViewUpdate },
  comments  : {
    CreateUsers
  },
  data      : () => ({
    headers           : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Name', align: 'left', sortable: 'false', value: 'fulName' },
      { text: 'Lastname', align: 'center', sortable: 'false', value: 'fulLastname' },
      { text: 'Email', align: 'center', sortable: 'false', value: 'email' },
      { text: 'Rol', align: 'center', sortable: 'true', value: 'rol.name' }
    ],
    itemsPagination   : 10,
    itemsPerPage      : [ 10, 25, 50, 100 ],
    page              : 1,
    loading           : false,
    loadingUser       : false,
    showUser          : false,
    showCreateUser    : false,
    showUpdatePassword: false,
    idUser            : '',
    user              : {}
  }),
  created() {
    this.getAllUsers( false )
    this.getAllRoles()
  },
  computed  : {
    ...mapGetters( [ 'getUsers', 'getPagination', 'getRoles' ] ),
    users() { return this.getUsers },
    pagination() { return this.getPagination },
    roles() { return this.getRoles }
  },
  methods   : {
    ...mapMutations( [ 'setConfirmAlert', 'setErrorAlert', 'setAlertOff' ] ),
    ...mapActions( [ 'findUsers', 'findRoles', 'updateUserRol', 'findUserById' ] ),
    async getAllUsers( payload ) {
      const query = {
        items: this.itemsPagination,
        page : payload ? 1 : this.page
      }
      await this.findUsers( query )
    },
    async getAllRoles() {
      await this.findRoles()
    },
    async save( item ) {
      const payload = {
        id : item._id,
        rol: item.rol._id
      }
      await this.updateUserRol( payload )
          .then( res => {
            if ( res.status === 200 ) {
              this.setConfirmAlert( res.body )
              setTimeout( () => this.setAlertOff(), 4000 )
            } else if ( res.status === 400 ) {
              this.setErrorAlert( res.body )
            }
            this.getAllUsers( false )
          } )
    },
    updatePwd( payload ) {
      this.idUser = payload
      this.showUpdatePassword = true
    },
    closeCreateUser( payload ) {
      this.showCreateUser = false
      this.getAllUsers( false )
      if ( payload.status ) {
        this.setConfirmAlert( payload )
        setTimeout( () => this.setAlertOff(), 4000 )
      }
    },
    closeUpdatePassword( payload ) {
      this.showUpdatePassword = false
      if ( payload.status ) {
        this.setConfirmAlert( payload )
        setTimeout( () => this.setAlertOff(), 4000 )
      }
    },
    async openShowUser( payload ) {
      this.loadingUser = true
      await this.findUserById( payload )
          .then( res => {
            if ( res.status === 200 ) {
              this.user = res.body.response
              this.showUser = true
            }
            this.loadingUser = false
          } )
    },
    closeShowUser( payload ) {
      this.showUser = false
      if ( payload.status ) {
        this.setConfirmAlert( payload )
        setTimeout( () => this.setAlertOff(), 4000 )
        this.getAllUsers( true )
      }
    }
  }
}
</script>
