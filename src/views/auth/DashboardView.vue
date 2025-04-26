<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="fill-height d-flex align-center justify-center bg-cover">
        <v-row class="d-flex justify-center">
          <v-col cols="12" sm="11" md="10" lg="6" xl="5">
            <v-card class="pa-10 text-center transparent-card card-position" elevation="10">
              <h2 class="text-h3 font-weight-bold mb-4 rainbow-text">
                <span class="welcome">Welcome to</span>
                <span class="campus"> Campus</span>
                <span class="quest"> Quest!</span>
              </h2>

              <p class="mb-6 text-body-1 text-white">
                Campus Quest is your all-in-one platform for navigating student life. From booking
                appointments to accessing campus services — everything you need is just a click
                away.
              </p>

              <router-link to="/login" style="text-decoration: none">
                <v-btn color="green-darken-3" size="large" elevation="6">
                  <v-icon left>mdi-rocket-launch</v-icon>
                  Get Started
                </v-btn>
              </router-link>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.card-position {
  position: relative;
  top: 0;
}


@media (min-width: 992px) {
  .card-position {
    top: -50px;
  }
}

.transparent-card {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  color: white;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.3);
  transition: all 0.3s ease;
}
.rainbow-text {
  animation: rainbow-text 5s linear infinite;
}

.welcome {
  animation: rainbow-text 5s linear infinite;
}

.campus {
  animation: rainbow-text 5s linear infinite;
  animation-delay: 0.5s;
}

.quest {
  animation: rainbow-text 5s linear infinite;
  animation-delay: 1s;
}

@keyframes rainbow-text {
  0% { color: #00e676; }
  33% { color: #00c853; }
  66% { color: #ffd740; }
  100% { color: #00e676; }
}
</style>
