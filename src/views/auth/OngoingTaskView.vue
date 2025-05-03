<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase' // adjust path as needed

const task = ref(null)
const statuses = [
  { text: 'Heading to Pickup Point' },
  { text: 'Ordering / Acquiring' },
  { text: 'En Route to Destination' },
  { text: 'Delivered' },
  { text: 'Completed (Rated)' },
]
const statusDescriptions = [
  'Task taker is on their way to the pickup point.',
  'Task taker is placing the order',
  'Task taker is on the way to the destination.',
  'Task has been successfully delivered or completed.',
  'Task creator has confirmed delivery and optionally rated the taker.',
]
const currentStatus = ref(0)
const events = ref([])
const input = ref(null)
const rating = ref(0)
const review = ref('')
const taskId = 1 // Replace with dynamic route param or prop

// Fetch task and timeline from Supabase
onMounted(async () => {
  // Fetch task
  const { data: taskData } = await supabase.from('tasks').select('*').eq('id', taskId).single()
  task.value = taskData

  // Set current status from task
  currentStatus.value = taskData.status

  // Fetch comments/timeline
  const { data: comments } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
  events.value =
    comments?.map((c) => ({
      id: c.id,
      text: c.text,
      time: new Date(c.created_at).toLocaleTimeString(),
    })) || []

  // Fetch review/rating if exists
  rating.value = taskData.ratings || 0
  review.value = taskData.review || ''
})

// Update status in Supabase
async function nextStatus() {
  if (currentStatus.value < statuses.length - 1) {
    currentStatus.value++
    await supabase.from('tasks').update({ status: currentStatus.value }).eq('id', task.value.id)
    task.value.status = currentStatus.value
  }
}
async function prevStatus() {
  if (currentStatus.value > 0) {
    currentStatus.value--
    await supabase.from('tasks').update({ status: currentStatus.value }).eq('id', task.value.id)
    task.value.status = currentStatus.value
  }
}

// Add comment to Supabase
async function comment() {
  if (!input.value) return
  const { data, error } = await supabase
    .from('task_comments')
    .insert([{ task_id: task.value.id, text: input.value }])
    .select()
    .single()
  if (!error) {
    events.value.unshift({
      id: data.id,
      text: data.text,
      time: new Date(data.created_at).toLocaleTimeString(),
    })
    input.value = null
  }
}

// Submit review to Supabase
async function submitReview() {
  await supabase
    .from('tasks')
    .update({ ratings: rating.value, review: review.value })
    .eq('id', task.value.id)
  alert(`Thank you for your review!\nRating: ${rating.value} stars\nReview: ${review.value}`)
}
</script>

<template>
  <DashboardView>
    <v-container fluid style="max-width: 700px">
      <!-- Task Summary Card -->
      <v-card class="mb-6 pa-6" elevation="2">
        <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-4">
          <div>
            <div class="text-h5 font-weight-bold mb-1">{{ task?.title }}</div>
            <v-chip color="primary" class="mr-2" label>{{ task?.type }}</v-chip>
          </div>
          <div>
            <v-chip color="success" class="mr-2" label>
              <v-icon start>mdi-currency-php</v-icon>
              {{ task?.service_fee }}
            </v-chip>
            <v-chip color="info" label>
              <v-icon start>mdi-credit-card</v-icon>
              {{ task?.payment }}
            </v-chip>
          </div>
        </div>
        <v-divider class="mb-4"></v-divider>
   
        <div class="mb-2">
          <v-icon color="deep-purple" class="mr-2">mdi-account</v-icon>
          <span class="font-weight-medium">Created by:</span>
          <span>{{ task?.created_by }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-purple" class="mr-2">mdi-account</v-icon>
          <span class="font-weight-medium">Requested by:</span>
          <span>{{ task?.requested_by }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-orange" class="mr-2">mdi-map-marker</v-icon>
          <span class="font-weight-medium">Pickup Location:</span>
          <span>{{task?.pickup_location }}</span>
        </div>
        <div class="mb-2">
          <v-icon color="deep-orange" class="mr-2">mdi-map-marker</v-icon>
          <span class="font-weight-medium">Destination:</span>
          <span>{{ task?.pickup_location }}</span>
        </div>

 
      </v-card>

      <!-- Status Timeline -->
      <v-card class="mb-6 pa-6" elevation="1">
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
        <v-timeline density="compact" side="end">
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
              <!-- Stars & Review form below Delivered -->
              <template v-if="idx === statuses.length - 2">
                <div class="text-center mt-4">
                  <v-rating
                    v-model="rating"
                    clearable
                    color="amber"
                    background-color="grey lighten-2"
                  ></v-rating>
                  <v-textarea
                    v-model="review"
                    label="Leave a review..."
                    auto-grow
                    rows="1"
                    class="mt-2"
                    hide-details
                  ></v-textarea>
                  <v-btn color="success" class="mt-2" :disabled="!rating" @click="submitReview">
                    Submit Review
                  </v-btn>
                </div>
              </template>
            </div>
          </v-timeline-item>
        </v-timeline>
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
</style>
