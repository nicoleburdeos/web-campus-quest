<script setup>
import DashboardView from './auth/DashboardView.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const { mobile } = useDisplay()

// Form data
const formData = ref({
  taskName: '',
  pickupPoint: '',
  destination: '',
  taskType: '',
  paymentMethod: '',
  quantity: 1,
  price: '',
})

const loading = ref(false)
const errorMessage = ref('')
const form = ref(null)

const rules = {
  required: (v) => !!v || 'This field is required',
  price: (v) => (v && v >= 5) || 'Minimum price is Php 5.00',
}

// Submit form
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  // Check for empty fields
  const emptyFields = Object.entries(formData.value).filter(([key, value]) => {
    return !value && key !== 'quantity' // Exclude quantity as it defaults to 1
  })

  if (emptyFields.length > 0) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      task_name: formData.value.taskName,
      pickup_point: formData.value.pickupPoint,
      destination: formData.value.destination,
      task_type: formData.value.taskType,
      payment_method: formData.value.paymentMethod,
      quantity: formData.value.quantity,
      price: formData.value.serviceFee,
      status: 'pending',
    })

    if (error) throw error

    // Redirect to task board on success
    router.push('/task-board')
  } catch (error) {
    errorMessage.value = error.message
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
              <v-form @submit.prevent="handleSubmit"></v-form>
              <v-alert v-if="errorMessage" type="error" variant="tonal" closable class="mb-4">
                {{ errorMessage }}
              </v-alert>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.taskName"
                        :rules="[rules.required, pickupPoint]"
                        hint="For example, foods, school supplies, etc"
                        label="Task Name"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.pickupPoint"
                        :rules="[rules.required, pickupPoint]"
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
                        :rules="[rules.required, destination]"
                        hint="For example, Kinaadman Bldg, Hiraya Bldg , etc"
                        label="Destination"
                        prepend-inner-icon="mdi-map-marker"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.taskType"
                        :rules="[rules.required, taskType]"
                        label="Task Type"
                        :items="['Food Delivery', 'Item Delivery', 'Ride Hailing']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.paymentMethod"
                        :rules="[rules.required, paymentMethod]"
                        label="Payment Method"
                        :items="['G-cash', 'Cash On Delivery']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-number-input
                        v-model="formData.quantity"
                        :rules="[rules.required, rules.quantity]"
                        label="Quantity"
                        control-variant="split"
                        inset
                      ></v-number-input>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.serviceFee"
                        :rules="[rules.required, rules.serviceFee]"
                        hint="Minimum of Php 5.00"
                        label="Service Fee"
                        prefix="Php "
                        variant="outlined"
                        min="5"
                        required
                      ></v-text-field>
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
