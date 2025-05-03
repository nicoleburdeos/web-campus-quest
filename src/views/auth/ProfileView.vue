<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { onMounted, ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const userData = ref({
  email: '',
  fullname: '',
  phone: '',
})

// Fetch user data
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

// Generate initials
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
      <v-card class="glass-card pa-10" elevation="10" max-width="1100" width="100%">
        <v-row>
          <!-- Left section: Avatar and Summary -->
          <v-col
            cols="12"
            md="4"
            class="text-center d-flex flex-column align-center justify-center"
          >
            <v-avatar size="150" color="green" class="mb-4">
              <span class="text-h3 text-white">{{ userInitials }}</span>
            </v-avatar>
            <div class="text-h5 font-weight-bold text-white mb-2">{{ userData.fullname }}</div>
            <v-rating value="5" color="amber" dense readonly size="22" class="mb-1" />
            <div class="text-caption text-white-70">214 ratings</div>
            <v-progress-linear value="85" height="8" color="primary" rounded class="my-2" />
            <div class="text-caption font-italic text-white-70">85% trust score</div>
          </v-col>

          <!-- Right section: User details -->
          <v-col cols="12" md="8">
            <div class="text-h5 text-white font-weight-medium mb-4 text-center mb-10">
              User Profile Information
            </div>
            <v-row>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="label">Email</div>
                <div class="value">{{ userData.email }}</div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="label">Mobile Number</div>
                <div class="value">{{ userData.phone }}</div>
              </v-col>
              <!-- Optional: Add more fields if needed -->
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

.glass-card {
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 0 32px rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 30%,
    transparent 60%
  );
  transition: all 0.7s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.7),
    inset 0 0 32px rgba(255, 255, 255, 0.05);
}

.glass-card:hover::before {
  left: 100%;
}

.value {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: all 0.3s ease;
}

.value:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  letter-spacing: 0.3px;
}

@media (max-width: 600px) {
  .glass-card {
    background: rgba(15, 15, 15, 0.85);
    padding: 1.5rem !important;
  }
}
</style>
