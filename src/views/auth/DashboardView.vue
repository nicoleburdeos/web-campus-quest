<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card
          class="pa-6 text-center"
          :max-width="useDisplay().mdAndDown ? '100%' : 800"
          elevation="6"
        >
          <h2 class="text-h4 font-weight-bold mb-4">Welcome to Campus Quest!</h2>
          <p class="mb-6">
            Campus Quest is your all-in-one platform for navigating student life. From booking
            appointments to accessing campus services — everything you need is just a click away.
          </p>

          <!-- Router Link to Login Page -->
          <router-link to="/login" style="text-decoration: none">
            <v-btn color="green-darken-3" size="large">
              <v-icon left>mdi-rocket-launch</v-icon>
              Get Started
            </v-btn>
          </router-link>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
