<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto" elevation="24">
            <v-card-title class="text-center">
              <v-img src="/public/images/cq logo.png" :height="mobile ? '150' : '100'"></v-img>
              <h2 class="font-weight-black">Campus Quest</h2>
              <p class="font-weight-bold">Login Form</p>
            </v-card-title>
            <v-card-text class="bg-surface-light pt-4">
              <v-form fast-fail @submit.prevent>
                <v-text-field label="Email" variant="outlined"></v-text-field>

                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

                <v-btn
                  class="mt-2"
                  type="submit"
                  block
                  prepend-icon="mdi-login"
                  color="green-darken-4"
                  >Login</v-btn
                >
              </v-form>
              <v-divider class="my-5"></v-divider>
              <h5 class="text-center">
                Dont have an account?
                <router-link class="text-primary" to="/register"
                  >Click here to register</router-link
                >
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
