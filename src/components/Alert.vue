<template>
  <v-layout justify-center row wrap>
    <v-snackbar
        v-model="alert"
        :color="color"
        bottom
        elevation="24"
        max-width="35rem"
        min-width="25rem"
        right
        timeout="-1"
    >
      <v-layout justify-space-around row wrap>
        <template>
          <v-icon color="white">{{ icon }}</v-icon>
        </template>
        <span class="text-subtitle-1 text-sm-center">{{ message }}</span>
        <v-flex v-if="status==='error' && errors !== null && Array.isArray(errors)" class="text-center ma-2" xs12>
          <v-card color="transparent" flat tile>
            <v-card-text>
              <v-layout justify-space-around row wrap>
                <v-flex xs3>Parámetro</v-flex>
                <v-divider vertical/>
                <v-flex xs7>Mensaje</v-flex>
                <v-flex xs12>
                  <v-divider/>
                </v-flex>
              </v-layout>
              <v-layout v-for="err in errors" :key="err.id" justify-space-around row wrap>
                <v-flex xs3>
                  <span class="text-caption">{{ err.param }}</span>
                </v-flex>
                <v-divider vertical/>
                <v-flex xs7>
                  <span class="text-caption">{{ err.message }}</span>
                </v-flex>
                <v-flex xs12>
                  <v-divider/>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions v-if="info!==null">
              <span class="text-caption">Error ID: {{ info.id }}</span>
              <v-spacer/>
              <span class="text-caption">IP Address: {{ info.ip }}</span>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <template v-slot:action="{ attrs }">
        <v-btn
            v-bind="attrs"
            color="white"
            icon
            @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name    : 'Alert',
  props   : {
    color  : {
      type   : String,
      default: 'green'
    },
    icon   : {
      type   : String,
      default: 'mdi-check'
    },
    status : {
      type   : String,
      default: 'success'
    },
    message: {
      type   : String,
      default: ''
    },
    errors : {
      type   : Array || String,
      default: null
    },
    info   : {
      type   : Object,
      default: null
    }
  },
  computed: {
    ...mapGetters( [ 'getAlert' ] ),
    alert() {
      return this.getAlert
    }
  },
  methods : {
    ...mapMutations( [ 'setAlert' ] ),
    close() {
      this.setAlert( false )
    }
  }
}
</script>

