<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto glass-card" elevation="0">
            <v-card-title class="text-center">
              <v-img src="/images/cq-logo.png" :height="mobile ? '150' : '100'"></v-img>
              <h2 class="font-weight-black rainbow-text">Campus Quest</h2>
              <p class="font-weight-bold">Login Form</p>
            </v-card-title>
            <v-card-text class="pt-2">
              <v-divider class="my-5"></v-divider>
              <LoginForm />
              <v-divider class="my-5"></v-divider>
              <h4 class="text-center">
                Don’t have an account?
                <router-link class="text-light-green-accent-3 font-weight-black" to="/register">
                  Click here to register
                </router-link>
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.15); /* Light glass effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
.rainbow-text {
  background: linear-gradient(
    to right,
    #1b5e20,
    #2e7d32,
    #388e3c,
    #1b5e20,
    #2e7d32,
    #388e3c,
    #1b5e20
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow 8s ease-in-out infinite;
  background-size: 400% auto;
  transition: all 0.3s ease;
}

@keyframes rainbow {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}
</style>
