<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const showNewTask = ref(false) // Controls visibility of the main content

const items = [
  'Food Delivery',
  'Item Delivery',
  'Ride Hailing',
]

const paymentMethods = [
  'Cash on Delivery',
  'G-cash',
]

// Form data and validation
const valid = ref(false)
const select = ref(null)
const taskname = ref('')
const pickupPoint = ref('')
const destination = ref('')
const price = ref('')
const payment = ref(null)

const nameRules = [v => !!v || 'This field is required']
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <v-row>
          <!-- Navigation Drawer -->
          <v-col cols="12" md="4">
            <v-navigation-drawer color="green-darken-4" expand-on-hover rail app>
              <v-list>
                <v-list-item
                  prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                  subtitle="sandra_a88@gmailcom"
                  title="Sandra Adams"
                ></v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-plus"
                  title="New Task"
                  value="newtask"
                  @click="showNewTask = true"
                ></v-list-item>
                <v-list-item prepend-icon="mdi-history" title="Recent Task" value="recentTask"></v-list-item>
                <v-list-item prepend-icon="mdi-logout" title="Log Out" value="log out"></v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-col>

          <!-- Main Content -->
          <v-col cols="12" md="8" v-if="showNewTask">
            <v-main>
              <v-row
                class="fill-height"
                align="center"
              >
                <v-col cols="12" md="6">
                  <v-card class="mx-auto glass-card" elevation="0">
                    <v-card-title class="text-center">
                      <v-img src="/images/cq-logo.png" :height="50"></v-img>
                      <h3 class="font-weight-black">New Task</h3>
                    </v-card-title>
                    <v-form v-model="valid">
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="taskname"
                              :counter="50"
                              :rules="nameRules"
                              label="Task Name"
                              required
                            ></v-text-field>
                          </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="pickupPoint"
                                :counter="50"
                                :rules="nameRules"
                                label="Pickup Point"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="destination"
                                :counter="50"
                                :rules="nameRules"
                                label="Destination"
                                required
                              ></v-text-field>
                            </v-col>
                      

                        
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="select"
                                :items="items"
                                :rules="[v => !!v || 'Task Type is required']"
                                label="Task Type"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="payment"
                                :items="paymentMethods"
                                :rules="[v => !!v || 'Payment Method is required']"
                                label="Payment Method"
                                required
                              ></v-select>
                            </v-col>
                          

                          <v-col cols="12">
                            <v-text-field
                              v-model="price"
                              :rules="[v => !!v || 'Price is required']"
                              label="Price"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-container>
                        <v-row justify="center">
                          <v-btn
                            class="mt-4"
                            color="success"
                            :disabled="!valid"
                            @click="submitForm"
                          >
                            Submit
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card>
                </v-col>
              </v-row>
            </v-main>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<script>
function submitForm() {
  console.log('Form submitted with the following data:')
  console.log({
    taskType: select.value,
    taskName: taskname.value,
    pickupPoint: pickupPoint.value,
    destination: destination.value,
    price: price.value,
    paymentMethod: payment.value,
  })
}
</script>

<style scoped>
.main-content {
  height: auto; /* Allow content to grow beyond the viewport height */
  overflow-y: auto; /* Enable scrolling if content overflows */
  padding-bottom: 2rem; /* Add spacing at the bottom */
}

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
