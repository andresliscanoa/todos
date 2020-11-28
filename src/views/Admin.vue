<template>
  <v-layout justify-center row wap>
    <v-flex xs12>
      <v-card flat>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer/>
          <v-btn fab large>
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
                  <v-tooltip color="purple lighten-3" left>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" color="blue" icon @click.native="updateRol(item._id)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Update rol</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md2 pt-3 sm4 xs1>
                  <v-tooltip color="purple lighten-3" left>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" color="blue" icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Update password</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md2 pt-3 sm4 xs1>
                  <v-tooltip color="purple lighten-3" left>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" color="blue" icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>See user</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
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
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name    : 'Admin',
  data    : () => ({
    headers        : [
      { text: 'Actions', align: 'center', value: 'actions', sortable: 'false' },
      { text: 'Name', align: 'left', sortable: 'false', value: 'fulName' },
      { text: 'Lastname', align: 'center', sortable: 'false', value: 'FulLastname' },
      { text: 'Email', align: 'center', sortable: 'false', value: 'email' },
      { text: 'Rol', align: 'center', sortable: 'true', value: 'rol.name' }
    ],
    itemsPagination: 10,
    itemsPerPage   : [ 10, 25, 50, 100 ],
    page           : 1,
    loading        : false
  }),
  created() {
    this.getAllUsers()
  },
  computed: {
    ...mapGetters( [ 'getUsers' ] ),
    users() { return this.getUsers }
  },
  methods : {
    ...mapActions( [ 'findUsers' ] ),
    async getAllUsers() {
      const query = {
        items: this.itemsPagination,
        page : this.page || 1
      }
      await this.findUsers( query )
    },
    updateRol( item ) {
      console.log( item )
    }
  }
}
</script>
