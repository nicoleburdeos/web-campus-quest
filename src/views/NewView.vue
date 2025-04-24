<script setup>
import DashboardView from './auth/DashboardView.vue'
import { ref } from 'vue'
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-card class="mx-auto glass-card" elevation="0">
            <v-img src="/images/cq-logo.png" height="70"></v-img>
            <v-card-title class="text-center">
              <h3 class="font-weight-black">New Task</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        hint="For example, foods, school supplies, etc"
                        label="Task Name"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        hint="For example, Kinaadman Bldg, Hiraya Bldg , etc"
                        label="Pickup Point"
                        prepend-inner-icon="mdi-map-marker"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        hint="For example, Kinaadman Bldg, Hiraya Bldg , etc"
                        label="Destination"
                        prepend-inner-icon="mdi-map-marker"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Task Type"
                        :items="['Food Delivery', 'Item Delivery', 'Ride Hailing']"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Payment Method"
                        :items="['G-cash', 'Cash On Delivery']"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Quantity"
                        model-value="1"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Price"
                        model-value="Php "
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn prepend-icon="mdi-check" color="green-darken-4">
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