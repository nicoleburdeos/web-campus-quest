<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const rules = {
  required: (value) => !!value || 'Field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
}
</script>
<template>
  <v-form fast-fail @submit.prevent>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field :rules="[rules.required]" label="First Name"></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field :rules="[rules.required]" label="Last Name"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          :rules="[rules.required, rules.email]"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :rules="[rules.required]"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :rules="[rules.required]"
          prepend-inner-icon="mdi-lock-outline"
          label="Confirm Password"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn class="mt-2" type="submit" block prepend-icon="mdi-account-plus" color="green-darken-4"
      >Register</v-btn
    >
  </v-form>
</template>
