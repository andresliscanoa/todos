<template>
  <v-layout justify-center row wrap>
    <alert :color="colorAlert" :errors="errorsAlert" :info="infoAlert" :message="messageAlert" :status="statusAlert"
           :timeOut="10000"/>
    <floating-button-menu/>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Alert                                    from '@/components/Alert'
import FloatingButtonMenu                       from '@/components/FloatingButtonMenu'

export default {
  name      : 'Home',
  components: {
    Alert,
    FloatingButtonMenu
  },
  data      : () => ({
    colorAlert  : '',
    messageAlert: '',
    statusAlert : '',
    errorsAlert : '' || [],
    infoAlert   : {}
  }),
  created() {
    this.dash()
  },
  computed  : {
    ...mapGetters( [ 'getUser', 'getDashboard' ] ),
    user() { return this.getUser },
    dashboard() { return this.getDashboard }
  },
  methods   : {
    ...mapMutations( [ 'setAlert' ] ),
    ...mapActions( [ 'getTodoDashboard' ] ),
    async dash() {
      await this.getTodoDashboard( this.user._id )
          .then( res => {
            if ( res.status !== 200 ) {
              this.setAlert( true )
              this.colorAlert = 'red'
              this.statusAlert = res.body.status
              this.messageAlert = res.body.message
              this.errorsAlert = res.body.response && res.body.response.err || null
              this.infoAlert = res.body.response && res.body.response.info || null
            }
          } )
    }
  }
}
</script>
