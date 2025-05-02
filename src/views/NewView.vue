<script setup>
import DashboardView from '../components/layout/DashboardView.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const { mobile } = useDisplay()

// Form data (match your Supabase column names)
const formData = ref({
  task_name: '',
  pickup_point: '',
  destination: '',
  task_type: '',
  payment_method: '',
  quantity: 1,
  service_fee: '',
  message: '',
})

const loading = ref(false)
const errorMessage = ref('')
const form = ref(null)

// Modify the rules object
const rules = {
  required: (v) => {
    if (v === null || v === undefined || v === '') {
      return 'This field is required'
    }
    return true
  },
  serviceFee: (v) => {
    if (!v) return 'Service fee is required'
    if (isNaN(v)) return 'Must be a valid number'
    if (v < 5) return 'Minimum price is Php 5.00'
    return true
  },
  quantity: (v) => {
    if (!v) return 'Quantity is required'
    if (isNaN(v)) return 'Must be a valid number'
    if (v < 1) return 'Quantity must be at least 1'
    return true
  },
}

// Update the handleSubmit function
const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    errorMessage.value = 'Please fill in all required fields correctly'
    return
  }

  // Check for empty required fields
  const requiredFields = [
    'task_name',
    'pickup_point',
    'destination',
    'task_type',
    'payment_method',
    'quantity',
    'service_fee',
  ]

  const emptyFields = requiredFields.filter((field) => !formData.value[field])

  if (emptyFields.length > 0) {
    errorMessage.value = `Please fill in all required fields: ${emptyFields.join(', ')}`
    return
  }

  try {
    loading.value = true

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError

    // Format the data
    const taskData = {
      user_id: user.id,
      task_name: formData.value.task_name,
      pickup_point: formData.value.pickup_point,
      destination: formData.value.destination,
      task_type: formData.value.task_type,
      payment_method: formData.value.payment_method,
      quantity: parseInt(formData.value.quantity),
      service_fee: parseFloat(formData.value.service_fee),
      message: formData.value.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    // Insert into Supabase
    const { error } = await supabase.from('tasks').insert([taskData])

    if (error) throw error

    // Clear form on success
    formData.value = {
      task_name: '',
      pickup_point: '',
      destination: '',
      task_type: '',
      payment_method: '',
      quantity: 1,
      service_fee: '',
      message: '',
    }

    // Redirect to task board
    router.push('/task-board')
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while saving the task'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-row justify="center" align="center">
        <!-- Left: Poster Image (hide pag mobile) -->
        <v-col cols="12" md="6" class="d-flex justify-center d-none d-md-flex">
          <v-img
            src="/images/img-poster.gif"
            :height="mobile ? '200' : '350'"
            :max-width="mobile ? '200' : '350'"
            class="mx-auto"
          ></v-img>
        </v-col>
        <!-- Right: New Task Form -->
        <v-col cols="12" md="5">
          <v-card class="mx-auto glass-card" elevation="0">
            <v-img src="/images/cq-logo.png" height="70"></v-img>
            <v-card-title class="text-center">
              <h3 class="font-weight-black">New Task</h3>
            </v-card-title>
            <v-card-text>
              <v-alert v-if="errorMessage" type="error" variant="tonal" closable class="mb-4">
                {{ errorMessage }}
              </v-alert>
              <v-form ref="form" @submit.prevent="handleSubmit">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.task_name"
                        :rules="[rules.required]"
                        hint="For example, foods, school supplies, etc"
                        label="Task Name"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.pickup_point"
                        :rules="[rules.required]"
                        hint="For example, Kinaadman Bldg, Hiraya Bldg , etc"
                        label="Pickup Point"
                        prepend-inner-icon="mdi-map-marker"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.destination"
                        :rules="[rules.required]"
                        hint="For example, Kinaadman Bldg, Hiraya Bldg , etc"
                        label="Destination"
                        prepend-inner-icon="mdi-map-marker"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.task_type"
                        :rules="[rules.required]"
                        label="Task Type"
                        :items="['Food Delivery', 'Item Delivery', 'Ride Hailing']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.payment_method"
                        :rules="[rules.required]"
                        label="Payment Method"
                        :items="['G-cash', 'Cash On Delivery']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.quantity"
                        :rules="[rules.required, rules.quantity]"
                        label="Quantity"
                        type="number"
                        min="1"
                        variant="outlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.service_fee"
                        :rules="[rules.required, rules.serviceFee]"
                        hint="Minimum of Php 5.00"
                        label="Service Fee"
                        prefix="Php "
                        variant="outlined"
                        min="5"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div class="mb-2">Message (optional)</div>
                      <v-textarea
                        v-model="formData.message"
                        :counter="300"
                        class="mb-2"
                        rows="2"
                        variant="outlined"
                        persistent-counter
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        type="submit"
                        prepend-icon="mdi-check"
                        color="green-darken-4"
                        :loading="loading"
                        :disabled="loading"
                      >
                        Submit
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DashboardView>
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

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.3);
  transition: all 0.3s ease;
}
</style>
