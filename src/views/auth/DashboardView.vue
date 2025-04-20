<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Background Image Container -->
      <v-container class="fill-height d-flex align-center justify-center bg-cover" fluid>
        <!-- Fade-in / Slide-up Animation -->
        <transition name="fade-slide" appear>
          <v-card
            class="pa-8 text-center transparent-card"
            :max-width="useDisplay().mdAndDown ? '100%' : 800"
            elevation="10"
          >
            <h2 class="text-h3 font-weight-bold mb-4 text-light-green-accent-3">
              Welcome to
              <span class="text-green-accent-4">Campus</span
              ><span class="text-yellow-accent-2"> Quest!</span>
            </h2>
            <p class="mb-6 text-body-1 text-white">
              Campus Quest is your all-in-one platform for navigating student life. From booking
              appointments to accessing campus services — everything you need is just a click away.
            </p>

            <router-link to="/login" style="text-decoration: none">
              <v-btn color="green-darken-3" size="large" elevation="6">
                <v-icon left>mdi-rocket-launch</v-icon>
                Get Started
              </v-btn>
            </router-link>
          </v-card>
        </transition>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Entrance Animation */
.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Full-screen background image */
.bg-cover {
  background-image: url('/images/bg-img.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Make the card semi-transparent to show background */
.transparent-card {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  color: white;
}

/* Button hover effect */
.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.3);
  transition: all 0.3s ease;
}
</style>
