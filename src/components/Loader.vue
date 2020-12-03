<template>
  <v-layout justify-center row wrap>
    <v-overlay
        opacity="1"
        z-index="1000"
    >
      <v-progress-circular
          :width="10"
          color="yellow"
          indeterminate
          size="130"
      >
        <span class="text-caption">Loading page</span>
      </v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
export default {
  name: 'loader'
}
</script>
