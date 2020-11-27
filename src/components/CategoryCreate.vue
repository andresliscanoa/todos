<template>
  <v-card flat>
    <v-app-bar color="transparent" flat>
      <v-toolbar-title>
        <span class="text-subtitle-1">Create Category</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click.native="closeCreateCategory">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-layout justify-center row wrap>
        <v-flex sm6 xs12>
          <v-text-field
              v-model="name"
              autofocus
              :error-messages="errorsName"
              color="purple"
              label="Category name"
              @focus="$v.name.$touch()"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
          :loading="loading"
          color="teal darken-2"
          large
          text
          @click.native="create"
          :disabled="this.$v.invalid"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapActions }       from 'vuex'

export default {
  name       : 'CategoryCreate',
  data       : () => ({
    name   : '',
    loading: false
  }),
  validations: {
    name: {
      required,
      minLength: minLength( 1 ),
      maxLength: maxLength( 100 ),
      async isUnique( value ) {
        if ( value === '' ) return true
        const res = await this.categoryUniqueName( value )
        return !!(await (res.status === 200 && res.body.message === 'Available value'))
      }
    }
  },
  computed   : {
    errorsName() {
      let err = []
      if ( !this.$v.name.$dirty ) return err
      if ( !this.$v.name.required ) {
        err.push( 'This field is required' )
      }
      if ( !this.$v.name.minLength ) {
        err.push( 'Minimum one character' )
      }
      if ( !this.$v.name.maxLength ) {
        err.push( 'Maximum 100 characters' )
      }
      if ( !this.$v.name.isUnique ) {
        err.push( 'Duplicated value' )
      }
      return err
    }
  },
  methods    : {
    ...mapMutations( [ 'setConfirmAlert', 'setErrorAlert', 'setAlertOff' ] ),
    ...mapActions( [ 'createCategories', 'categoryUniqueName' ] ),
    async create() {
      if ( !this.$v.invalid ) {
        this.loading = true
        await this.createCategories( { name: this.name } )
            .then( res => {
              this.loading = false
              if ( res.status === 200 ) {
                this.setConfirmAlert( res.body )
                this.closeCreateCategory()
                setTimeout( () => this.setAlertOff(), 4000 )
              } else if ( res.status === 400 ) {
                this.setErrorAlert( res.payload )
              }
            } )
      }
    },
    closeCreateCategory() {
      this.name = ''
      this.$emit( 'closeCreateCategory' )
      this.$v.$reset()
    }
  }
}
</script>
