<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const bookingId = route.params.id
const booking = ref()
const statuses = [
  { text: 'Heading to Pickup Point' },
  { text: 'Ordering / Acquiring' },
  { text: 'En Route to Destination' },
  { text: 'Delivered' },
  { text: 'Completed' },
]
const statusDescriptions = [
  'Task taker is on their way to the pickup point.',
  'Task taker is placing the order',
  'Task taker is on the way to the destination.',
  'Task has been successfully delivered or completed.',
  'Task creator has confirmed delivery.',
]
const currentStatus = ref(0)
const rating = ref(0)

onMounted(async () => {
  if (!bookingId) {
    console.error('No bookingId in route params')
    return
  }
  const { data, error } = await supabase
    .from('task_bookings')
    .select(
      `
      *,
      tasks (
        id, task_name, task_type, service_fee, payment_method, pickup_point, destination,
        quantity, status, message, creator_name
      ),
      task_requests (
        id, fullname, phone, created_at
      )
    `,
    )
    .eq('id', bookingId)
    .single()

  if (error) {
    console.error('Error fetching booking:', error)
    return
  }
  booking.value = data

  // Ensure status is a number (default to 0 if not)
  const statusNum =
    typeof data.tasks?.status === 'number' ? data.tasks.status : parseInt(data.tasks?.status) || 0
  currentStatus.value = statusNum

  await syncStatus()

  // Poll every 3 seconds to keep status in sync
  setInterval(syncStatus, 3000)
})

// Update status in Supabase
async function nextStatus() {
  if (currentStatus.value < statuses.length - 1) {
    currentStatus.value++
    await supabase
      .from('tasks')
      .update({ status: currentStatus.value })
      .eq('id', booking.value.tasks.id)
    booking.value.tasks.status = currentStatus.value
  }
}
async function prevStatus() {
  if (currentStatus.value > 0) {
    currentStatus.value--
    await supabase
      .from('tasks')
      .update({ status: currentStatus.value })
      .eq('id', booking.value.tasks.id)
    booking.value.tasks.status = currentStatus.value
  }
}

// Sync status from Supabase
async function syncStatus() {
  const { data, error } = await supabase
    .from('tasks')
    .select('status')
    .eq('id', booking.value.tasks.id)
    .single()
  if (!error && data) {
    currentStatus.value = typeof data.status === 'number' ? data.status : parseInt(data.status) || 0
    booking.value.tasks.status = currentStatus.value
  }
}

// Submit rating to Supabase
async function submitRating() {
  // Update rating in task_bookings
  await supabase
    .from('task_bookings')
    .update({
      rating: rating.value,
    })
    .eq('id', bookingId)

  // Update the task status to 'complete' (string)
  await supabase
    .from('tasks')
    .update({
      status: 'complete',
    })
    .eq('id', booking.value.tasks.id)

  currentStatus.value = statuses.length - 1
  booking.value.tasks.status = 'complete'
  booking.value.rating = rating.value

  // Optional: If you want to trigger a UI update in TaskboardView.vue immediately,
  // you can emit an event or use a global state/store.
}
</script>

<template>
  <DashboardView>
    <v-container fluid style="max-width: 700px">
      <!-- Task Summary Card -->
      <v-card class="mb-6 pa-6 glass-card" elevation="2">
        <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-4">
          <div>
            <div class="text-h5 font-weight-bold mb-1">
              {{ booking?.tasks?.task_name || 'No Task Name' }}
            </div>
            <v-chip color="primary" class="mr-2" label>{{ booking?.tasks?.task_type }}</v-chip>
          </div>
          <div>
            <v-chip color="success" class="mr-2" label>
              <v-icon start>mdi-currency-php</v-icon>
              {{ booking?.tasks?.service_fee }}
            </v-chip>
            <v-chip color="info" label>
              <v-icon start>mdi-credit-card</v-icon>
              {{ booking?.tasks?.payment_method }}
            </v-chip>
          </div>
        </div>
        <v-divider class="mb-4"></v-divider>

        <div class="mb-2">
          <v-icon color="deep-purple" class="mr-2">mdi-account</v-icon>
          <span class="font-weight-medium">Created by:</span>
          <span>{{ booking?.tasks?.creator_name }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-purple" class="mr-2">mdi-account</v-icon>
          <span class="font-weight-medium">Requested by:</span>
          <span>{{ booking?.task_requests?.fullname }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-orange" class="mr-2">mdi-map-marker</v-icon>
          <span class="font-weight-medium">Pickup Location:</span>
          <span>{{ booking?.tasks?.pickup_point }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-orange" class="mr-2">mdi-map-marker</v-icon>
          <span class="font-weight-medium">Destination:</span>
          <span>{{ booking?.tasks?.destination }}</span>
        </div>
      </v-card>

      <!-- Status Timeline -->
      <v-card class="mb-6 pa-6 glass-card" elevation="1">
        <div class="d-flex justify-space-between align-center mb-4">
          <v-btn
            :disabled="currentStatus === 0"
            @click="prevStatus"
            color="primary"
            variant="outlined"
            >Previous</v-btn
          >
          <div class="font-weight-bold">Current Status: {{ statuses[currentStatus].text }}</div>
          <v-btn
            :disabled="currentStatus === statuses.length - 1"
            @click="nextStatus"
            color="primary"
            variant="outlined"
            >Next</v-btn
          >
        </div>
        <v-timeline density="compact" side="end" line-color="light-green-darken-2">
          <v-timeline-item
            v-for="(status, idx) in statuses"
            :key="status.text"
            :dot-color="idx === currentStatus ? 'green-darken-4' : 'grey'"
            :fill-dot="idx === currentStatus"
            :elevation="idx === currentStatus ? 8 : 1"
            size="large"
            class="mb-4"
          >
            <div class="d-flex flex-column flex-grow-1">
              <div>
                <span v-if="idx === currentStatus" class="font-weight-bold">{{ status.text }}</span>
                <span v-else>{{ status.text }}</span>
              </div>
              <div class="text-grey text-body-2 mb-1">{{ statusDescriptions[idx] }}</div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card>

      <v-card class="mb-6 pa-6 glass-card" elevation="2" v-if="currentStatus === 3">
        <div class="text-center">
          <v-rating v-model="rating" clearable></v-rating>
          <div class="mt-2">Rate your delivery!</div>
          <v-btn class="mt-4" color="primary" @click="submitRating" :disabled="rating === 0">
            Submit
          </v-btn>
        </div>
      </v-card>

      <v-card class="mb-6 pa-6 glass-card" elevation="2" v-if="currentStatus === 4">
        <div class="text-center">
          <v-btn class="mt-4" color="primary" @click="router.push('/task-board')">
            Return to Taskboard
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </DashboardView>
</template>

<style scoped>
.profile-card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(60, 60, 60, 0.07);
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
</style>
