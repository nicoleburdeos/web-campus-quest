<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { onMounted, ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const userData = ref({
  email: '',
  fullname: '',
  phone: '',
})

const getUser = async () => {
  const {
    data: {
      user: { user_metadata: metadata },
    },
  } = await supabase.auth.getUser()

  userData.value.email = metadata.email
  userData.value.fullname = `${metadata.firstname} ${metadata.lastname}`
  userData.value.phone = metadata.phone
}

const userInitials = computed(() => {
  const names = userData.value.fullname.trim().split(' ')
  return names
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2)
})

onMounted(() => {
  getUser()
})
</script>

<template>
  <DashboardView>
    <v-container fluid class="fill-height d-flex justify-center align-center">
      <v-card class="profile-card pa-10 glow-border" elevation="12" max-width="1080" width="100%">
        <v-row>
          <!-- Avatar & Summary -->
          <v-col
            cols="12"
            md="4"
            class="text-center d-flex flex-column align-center justify-center"
          >
            <v-avatar size="140" color="green darken-4" class="mb-4 shadow-lg">
              <span class="text-h3 text-white font-weight-bold">{{ userInitials }}</span>
            </v-avatar>
            <div class="text-h5 font-weight-bold text-white mb-1">{{ userData.fullname }}</div>
            <v-rating value="5" color="yellow darken-2" dense readonly size="22" class="mb-1" />
            <div class="text-caption text-muted">214 ratings</div>
            <v-progress-linear value="85" height="8" color="green" rounded class="my-2" />
            <div class="text-caption font-italic text-muted">85% trust score</div>
          </v-col>

          <!-- User Info & Glowing GIF -->
          <v-col cols="12" md="8">
            <div class="text-h5 text-white font-weight-medium text-center mb-6">
              Profile Information
            </div>
            <v-row>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="info-label">Email</div>
                <div class="info-value green-glow">{{ userData.email }}</div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="info-label">Mobile Number</div>
                <div class="info-value green-glow">{{ userData.phone }}</div>
              </v-col>
              <!-- Centered Glowing GIF -->
              <v-col cols="12" class="text-center mt-6 d-flex justify-center align-center">
                <v-img src="/gifs/user2.gif" width="250" height="300" cover class="gif-container" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </DashboardView>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.profile-card {
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(18px) saturate(180%);
  border-radius: 20px;
  border: 2px solid transparent;
  color: rgba(255, 255, 255, 0.95);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
}

.text-muted {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 500;
  z-index: 1;
  overflow: hidden;
}

/* Green-Yellow-Black Border Animation */
@keyframes glowCycle {
  0% {
    border-color: green;
    box-shadow: 0 0 8px green;
  }
  33% {
    border-color: yellow;
    box-shadow: 0 0 8px yellow;
  }
  66% {
    border-color: black;
    box-shadow: 0 0 8px black;
  }
  100% {
    border-color: green;
    box-shadow: 0 0 8px green;
  }
}

.glow-border {
  animation: glowCycle 6s infinite ease-in-out;
}

.green-glow {
  border: 2px solid green;
  animation: glowCycle 6s infinite ease-in-out;
  background-clip: padding-box;
  border-radius: 12px;
}

.gif-container {
  margin: 0 auto;
  display: block;
}

/* Responsive Padding Fix */
@media (max-width: 600px) {
  .profile-card {
    padding: 1.25rem !important;
  }

  .gif-container {
    width: 200px;
    height: 240px;
  }
}
</style>
