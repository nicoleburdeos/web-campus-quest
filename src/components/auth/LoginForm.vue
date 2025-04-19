<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const rules = {
  required: (value) => !!value || 'Field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
}
</script>
<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      :rules="[rules.required, rules.email]"
      label="Email"
      prepend-inner-icon="mdi-email-outline"
    ></v-text-field>

    <v-text-field
      :rules="[rules.required]"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>

    <v-btn class="mt-2" type="submit" block prepend-icon="mdi-login" color="green-darken-4"
      >Login</v-btn
    >
  </v-form>
</template>
