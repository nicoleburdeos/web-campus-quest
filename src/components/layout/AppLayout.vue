<script setup>
import { ref } from 'vue'

const theme = ref('light')

// function onClick() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
</script>
<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- Background image added here -->
      <v-main
        style="
          background-image: url('/images/bg-img.png');
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          background-attachment: fixed;
        "
      >
        <slot name="content"></slot>
      </v-main>
    </v-app>
  </v-responsive>
</template>
