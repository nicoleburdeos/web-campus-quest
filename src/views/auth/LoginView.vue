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
        <v-col cols="10" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto" elevation="24">
            <v-card-title class="text-center">
              <v-img src="/images/cq-logo.png" :height="mobile ? '150' : '100'"></v-img>
              <h2 class="font-weight-black">Campus Quest</h2>
              <p class="font-weight-bold">Login Form</p>
            </v-card-title>
            <v-card-text class="bg-surface-light pt-4">
              <v-divider class="my-5"></v-divider>
              <LoginForm />
              <v-divider class="my-5"></v-divider>
              <h4 class="text-center">
                Don’t have an account?
                <router-link class="text-green-darken-1 font-weight-black" to="/register">
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
  .v-card {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    backdrop-filter: blur(4px);
    color: black;
  }

  .v-card-title {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    color: white;
    padding: 16px;
  }

  .v-card-text {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    color: black;
    padding: 16px;
  }
