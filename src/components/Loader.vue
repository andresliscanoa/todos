<template>
  <v-layout justify-center row wrap>
    <v-overlay
        opacity="0.8"
        z-index="1000"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
export default {
  name: 'loader'
}
</script>
