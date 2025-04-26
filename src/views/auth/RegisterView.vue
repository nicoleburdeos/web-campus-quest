<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
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
              <v-img src="/images/cq-logo.png" :height="mobile ? '150' : '100'"></v-img>
              <h2 class="font-weight-black">Campus Quest</h2>
              <p class="font-weight-bold">Registration Form</p>
            </v-card-title>
            <v-card-text class="bg-surface-light pt-4">
              <v-divider class="my-5"></v-divider>
              <RegistrationForm></RegistrationForm>

              <v-divider class="my-5"></v-divider>
              <h4 class="text-center">
                Already have an account?
                <router-link class="text-green-darken-1 font-weight-black" to="/"
                  >Click here to login</router-link
                >
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
