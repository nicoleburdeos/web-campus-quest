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
              <p class="font-weight-bold">Registration Form</p>
            </v-card-title>
            <v-card-text class="bg-surface-light pt-4">
              <v-form fast-fail @submit.prevent>
                <v-text-field label="First Name" variant="outlined"></v-text-field>
                <v-text-field label="Last Name" variant="outlined"></v-text-field>
                <v-text-field label="Email" variant="outlined"></v-text-field>

                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>
                <v-text-field
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                ></v-text-field>

                <v-btn
                  class="mt-2"
                  type="submit"
                  block
                  prepend-icon="mdi-account-plus"
                  color="green-darken-4"
                  >Register</v-btn
                >
              </v-form>
              <v-divider class="my-5"></v-divider>
              <h5 class="text-center">
                Already have an account?
                <router-link class="text-primary" to="/login">Click here to login</router-link>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
