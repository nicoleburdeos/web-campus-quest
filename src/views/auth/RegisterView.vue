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
          <v-card class="mx-auto glass-card" elevation="0">
            <v-card-title class="text-center">
              <v-img src="/images/cq-logo.png" :height="mobile ? '150' : '100'"></v-img>
              <h2 class="font-weight-black">Campus Quest</h2>
              <p class="font-weight-bold">Registration Form</p>
            </v-card-title>
            <v-card-text class="pt-2">
              <v-divider class="my-5"></v-divider>
              <RegistrationForm></RegistrationForm>

              <v-divider class="my-5"></v-divider>
              <h4 class="text-center">
                Already have an account?
                <router-link class="text-green-darken-1 font-weight-black" to="/login"
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
</style>
