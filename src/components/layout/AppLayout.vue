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
      <v-app-bar class="px-2" color="green-darken-4" height="80" app>
        <v-img
          src="/images/cq-logo-text.png"
          max-height="300"
          max-width="300"
          class="mt-7"
          contain
        ></v-img>

        <v-spacer></v-spacer>

        <!-- <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          color="green-darken-3"
          slim
          @click="onClick"
        ></v-btn> -->
      </v-app-bar>
      <!-- Background image added here -->
      <v-main
        style="
          background-image: url('/images/bg-img.png');
          background-size: cover;
          background-position: center;
          min-height: 100vh;
        "
      >
        <slot name="content"></slot>
      </v-main>

      <v-footer class="font-weight-bold" color="green-darken-4" border app>
        Copyright © 2025 Campus Quest | All rights reserved.</v-footer
      >
    </v-app>
  </v-responsive>
</template>
