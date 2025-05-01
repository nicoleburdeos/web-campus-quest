<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const isPasswordVisible = ref(false)
const refVForm = ref()
const router = useRouter()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({ ...formDataDefault })

const onSubmit = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })
  if (error) {
    alert('Login failed: ' + error.message)
  } else {
    router.replace('/dashboard') 
  }
}

const onFormSubmit = () => {
  refVForm.value.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-btn class="mt-2" type="submit" color="green-darken-4" prepend-icon="mdi-login" block>
      Login
    </v-btn>
  </v-form>
</template>
