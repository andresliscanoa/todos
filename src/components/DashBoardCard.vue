<template>
  <v-card :color="color">
    <v-app-bar color="transparent" dark flat>
      <v-toolbar-title><span class="text-button">{{ title }}</span></v-toolbar-title>
      <v-spacer/>
      <v-btn
          dark
          fab
          outlined
      >
        {{ total }}
      </v-btn>
    </v-app-bar>
  </v-card>
</template>
<script>
export default {
  name : 'DashBoardCard',
  props: {
    color: {
      type   : String,
      default: 'cyan'
    },
    title: {
      type   : String,
      default: ''
    },
    total: {
      type   : Number,
      default: 0
    }
  }
}
</script>
