<script setup>
import DashboardView from './DashboardView.vue'
import { ref } from 'vue'
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-main>
        <!-- Add your Task Board content here -->
        <div class="main-content">
          <v-col cols="12" md="6" lg="6">
            <v-card class="mx-auto glass-card" elevation="0">
              <v-img src="/images/cq-logo.png" :height="mobile ? '100' : '70'"></v-img>
              <v-card-title class="text-center">
                <h3 class="font-weight-black">Recent Task</h3>
              </v-card-title>
              <!-- Example placeholder for tasks -->
              <v-card-text>
                <div class="text-center">No tasks to display.</div>
              </v-card-text>
            </v-card>
          </v-col>
        </div>
      </v-main>
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
