<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const { mobile } = useDisplay()
const currentTab = ref(0)

const tasks = ref([])
const requests = ref([])
const loading = ref(false)
const error = ref('')

// Add after other refs
const userHasCreatedTasks = ref(false)
const readRequestIds = ref(new Set())

// Snackbar state
const snackbar = ref(false)
const snackbarMessage = ref('')

// Add this in your <script setup>
const requestorRatings = ref({})

// Add function to get storage key for current user
const getStorageKey = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? `readRequests_${user.id}` : null
}

// Fetch tasks from Supabase
const fetchTasks = async () => {
  loading.value = true
  error.value = ''
  const { data, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (fetchError) {
    error.value = fetchError.message
  } else {
    tasks.value = data
  }
  loading.value = false
}

// Replace the existing fetchRequests function
const fetchRequests = async () => {
  loading.value = true
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    requests.value = []
    loading.value = false
    return
  }

  // Get all tasks created by the current user
  const { data: userTasks } = await supabase.from('tasks').select('id').eq('user_id', user.id)

  if (!userTasks || !userTasks.length) {
    requests.value = []
    loading.value = false
    return
  }

  // Get task IDs created by the user
  const userTaskIds = userTasks.map((task) => task.id)

  // Get requests for those tasks
  const { data, error: fetchError } = await supabase
    .from('task_requests')
    .select('*')
    .in('task_id', userTaskIds)
    .order('created_at', { ascending: false })

  if (!fetchError) {
    requests.value = data
    // Clean up stored read IDs that no longer exist
    const currentIds = new Set(data.map((req) => req.id))
    readRequestIds.value = new Set([...readRequestIds.value].filter((id) => currentIds.has(id)))
    const storageKey = await getStorageKey()
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify([...readRequestIds.value]))
    }
  } else {
    requests.value = []
  }
  loading.value = false
}

onMounted(async () => {
  const storageKey = await getStorageKey()
  if (storageKey) {
    readRequestIds.value = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'))
  }
  fetchTasks()
  fetchRequests()
})

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  setInterval(async () => {
    // Check if this user has an accepted booking that is not yet rated
    const { data } = await supabase
      .from('task_bookings')
      .select('id, rating')
      .eq('user_id', user.id)
      .eq('task_status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(1)
    if (data && data.length && !data[0].rating) {
      router.push(`/ongoingtask/${data[0].id}`)
    }
  }, 3000) // Poll every 3 seconds
})

// Add computed properties for notification count
const unreadRequests = computed(() => {
  return requests.value.filter((req) => !readRequestIds.value.has(req.id))
})

const requestCount = computed(() => unreadRequests.value.length)
const formattedRequestCount = computed(() => {
  return requestCount.value > 9 ? '9+' : requestCount.value.toString()
})

// Modify function to mark requests as read
const markRequestsAsRead = async () => {
  const storageKey = await getStorageKey()
  if (storageKey) {
    const newReadIds = requests.value.map((req) => req.id)
    readRequestIds.value = new Set([...readRequestIds.value, ...newReadIds])
    localStorage.setItem(storageKey, JSON.stringify([...readRequestIds.value]))
  }
}

// Add watch for tab changes
watch(currentTab, (newValue) => {
  if (newValue === 1) {
    // When Task Requests tab is selected
    markRequestsAsRead()
  }
})

const hasUserRequestedTask = async (taskId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return true // Prevent request if no user

  const { data } = await supabase
    .from('task_requests')
    .select('id')
    .eq('task_id', taskId)
    .eq('user_id', user.id)
    .single()

  return !!data
}

const requestTask = async (task, isActive) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  if (task.status === 'accepted') {
    snackbar.value = true
    snackbarMessage.value = 'This task has already been accepted '
    return
  }

  // Check if user has already requested this task
  const alreadyRequested = await hasUserRequestedTask(task.id)
  if (alreadyRequested) {
    error.value = 'You have already requested this task'
    return
  }

  const fullname =
    `${user.user_metadata.firstname || ''} ${user.user_metadata.lastname || ''}`.trim()
  const phone = user.user_metadata.phone || ''
  const ratings = user.user_metadata.ratings || 'N/A'

  // Insert a new request for this task
  const { error: requestError } = await supabase.from('task_requests').insert([
    {
      task_id: task.id,
      user_id: user.id,
      fullname,
      phone,
      ratings,
      created_at: new Date().toISOString(),
    },
  ])

  if (!requestError) {
    isActive.value = false
    await fetchRequests()
  } else {
    error.value = requestError.message
  }
}

const acceptRequest = async (req, isActive) => {
  // Delete all other requests for this task
  const { error: deleteError } = await supabase
    .from('task_requests')
    .delete()
    .eq('task_id', req.task_id)
    .neq('id', req.id)

  // Update the related task status
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'accepted' })
    .eq('id', req.task_id)

  if (!taskError && !deleteError) {
    // Update the local tasks array immediately for instant UI feedback
    const taskIdx = tasks.value.findIndex((t) => t.id === req.task_id)
    if (taskIdx !== -1) {
      tasks.value[taskIdx].status = 'accepted'
    }

    // Insert a new booking for this task
    const { data, error: bookingError } = await supabase
      .from('task_bookings')
      .insert([
        {
          task_id: req.task_id,
          user_id: req.user_id,
          task_status: 'accepted',
          request_id: req.id,
        },
      ])
      .select('id')

    if (!bookingError) {
      isActive.value = false
      await fetchRequests()
      await fetchTasks()
      router.push(`/ongoingtask/${data[0].id}`) // Removed redirect
    } else {
      error.value = bookingError.message
    }
  } else {
    error.value = taskError?.message || deleteError?.message
  }
}

// Add this in your <script setup> in TaskboardView.vue
const getUserAverageRating = async (userId) => {
  const { data, error } = await supabase
    .from('task_bookings')
    .select('rating')
    .eq('user_id', userId)
    .not('rating', 'is', null)

  if (data && data.length) {
    const ratings = data.map((r) => Number(r.rating)).filter((r) => !!r)
    return ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
  }
  return 0
}

// Add this function
const fetchRequestorRating = async (req) => {
  if (!requestorRatings.value[req.user_id]) {
    requestorRatings.value[req.user_id] = await getUserAverageRating(req.user_id)
  }
}
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-main>
        <div class="main-content">
          <v-col cols="12" md="9" lg="9">
            <v-card class="mx-auto glass-card" elevation="0">
              <v-img src="/images/cq-logo.png" :height="mobile ? '100' : '70'"></v-img>
              <v-tabs v-model="currentTab" color="green-darken-4" align-tabs="center" grow>
                <v-tab :value="0">Task Quest<v-icon class="tab-icon">mdi-store</v-icon></v-tab>
                <v-tab :value="1">
                  Task Requests
                  <v-badge
                    :content="formattedRequestCount"
                    :model-value="unreadRequests.length > 0"
                    color="red-accent-4"
                    location="top end"
                    size="large"
                    scale="1.5"
                    class="tab-icon"
                  >
                    <v-icon>mdi-bell</v-icon>
                  </v-badge>
                </v-tab>
              </v-tabs>
              <v-card-text>
                <v-window v-model="currentTab">
                  <!-- Task Quest Tab -->
                  <v-window-item :value="0">
                    <v-progress-circular
                      v-if="loading"
                      indeterminate
                      color="green-darken-4"
                      class="mx-auto"
                    />
                    <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
                    <v-list v-if="!loading && tasks.length" class="transparent-list">
                      <template v-for="task in tasks" :key="task.id">
                        <v-list-item
                          :title="task.task_name"
                          :subtitle="`${new Date(task.created_at).toLocaleTimeString()}`"
                        >
                          <template #prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>

                          <template #append>
                            <v-chip
                              class="ms-3"
                              :color="
                                task.status === 'accepted'
                                  ? 'green'
                                  : task.status === 'complete'
                                    ? 'green-darken-4'
                                    : 'orange'
                              "
                              label
                              small
                              text-color="white"
                            >
                              {{
                                task.status === 'accepted'
                                  ? 'Accepted'
                                  : task.status === 'complete'
                                    ? 'Complete'
                                    : 'Pending'
                              }}
                            </v-chip>
                            <v-btn icon variant="plain" size="small" class="info-btn">
                              <v-icon>mdi-information</v-icon>
                              <v-dialog activator="parent" max-width="500">
                                <template v-slot:default="{ isActive }">
                                  <v-card rounded="lg">
                                    <v-card-title class="d-flex justify-space-between align-center">
                                      <div class="d-flex align-center">
                                        <v-icon class="me-2">mdi-information</v-icon>
                                        <div class="text-h5 text-medium-emphasis ps-2">
                                          Task Info
                                        </div>
                                      </div>
                                      <v-btn
                                        icon="mdi-close"
                                        variant="text"
                                        @click="isActive.value = false"
                                      ></v-btn>
                                    </v-card-title>
                                    <v-divider class="mb-4"></v-divider>
                                    <v-card-text>
                                      <div class="text-medium-emphasis mb-4">
                                        <h1>Task Name: {{ task.task_name }}</h1>
                                      </div>
                                      <div class="mb-2">Task ID: #{{ task.id }}</div>
                                      <div class="mb-2">
                                        Created by:
                                        <span class="font-weight-bold">
                                          {{ task.creator_name }}
                                        </span>
                                      </div>
                                      <br />
                                      <v-row class="tight-row">
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Pickup point:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{
                                          task.pickup_point
                                        }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Destination:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{
                                          task.destination
                                        }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Task Type:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{
                                          task.task_type
                                        }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Payment Method:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{
                                          task.payment_method
                                        }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Quantity:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{
                                          task.quantity
                                        }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Service Fee:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0"
                                          >Php {{ task.service_fee }}</v-col
                                        >

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Status:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0"> {{ task.status }}</v-col>
                                      </v-row>
                                      <br />
                                      <!-- Show alert for accepted or completed status -->
                                      <v-alert
                                        v-if="
                                          task.status === 'accepted' || task.status === 'complete'
                                        "
                                        :type="task.status === 'accepted' ? 'success' : 'info'"
                                        class="mb-2"
                                        border="start"
                                        :color="task.status === 'accepted' ? 'green' : 'blue'"
                                      >
                                        {{
                                          task.status === 'accepted'
                                            ? 'This task has already been accepted.'
                                            : 'This task has been completed.'
                                        }}
                                      </v-alert>
                                      <div class="mb-2">Message (optional)</div>
                                      <v-textarea
                                        :counter="300"
                                        class="mb-2"
                                        rows="2"
                                        variant="outlined"
                                        persistent-counter
                                        readonly
                                        v-model="task.message"
                                      ></v-textarea>
                                    </v-card-text>
                                    <v-divider class="mt-2"></v-divider>
                                    <v-card-actions class="my-2 d-flex justify-end">
                                      <v-btn
                                        class="text-none"
                                        rounded="xl"
                                        text="Cancel"
                                        @click="isActive.value = false"
                                      ></v-btn>
                                      <v-btn
                                        class="text-none"
                                        color="green"
                                        rounded="xl"
                                        text="Request"
                                        variant="flat"
                                        :disabled="
                                          task.status === 'accepted' || task.status === 'complete'
                                        "
                                        @click="requestTask(task, isActive)"
                                      >
                                        Request
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </template>
                              </v-dialog>
                            </v-btn>
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                        <br />
                      </template>
                    </v-list>
                    <div v-if="!loading && !tasks.length" class="text-center">
                      No tasks to display.
                    </div>
                  </v-window-item>
                  <!-- Task Requests Tab -->
                  <v-window-item :value="1">
                    <v-list v-if="!loading && requests.length" class="transparent-list">
                      <template v-for="req in requests" :key="req.id">
                        <v-list-item :title="req.fullname" :subtitle="'Task ID: ' + req.task_id">
                          <template #prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>
                          <template #append>
                            <v-btn icon variant="plain" size="small" class="info-btn">
                              <v-icon>mdi-information</v-icon>
                              <v-dialog
                                activator="parent"
                                max-width="500"
                                @update:model-value="(val) => val && fetchRequestorRating(req)"
                              >
                                <template v-slot:default="{ isActive }">
                                  <v-card rounded="lg">
                                    <v-card-title class="d-flex justify-space-between align-center">
                                      <div class="d-flex align-center">
                                        <v-icon class="me-2">mdi-information</v-icon>
                                        <div class="text-h5 text-medium-emphasis ps-2">
                                          Request Info
                                        </div>
                                      </div>
                                      <v-btn
                                        icon="mdi-close"
                                        variant="text"
                                        @click="isActive.value = false"
                                      ></v-btn>
                                    </v-card-title>
                                    <v-divider class="mb-4"></v-divider>
                                    <v-card-text>
                                      <div class="text-medium-emphasis mb-4">
                                        <h1>
                                          Requested by: <br />
                                          {{ req.fullname }}
                                        </h1>
                                      </div>
                                      <div class="mb-2">Task ID: #{{ req.task_id }}</div>

                                      <v-row class="tight-row">
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Phone:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{ req.phone }}</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Rating:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">
                                          <v-rating
                                            :model-value="requestorRatings[req.user_id] || 0"
                                            color="yellow-darken-3"
                                            half-increments
                                            dense
                                            readonly
                                            size="22"
                                          />
                                          <span v-if="requestorRatings[req.user_id]"
                                            >({{
                                              requestorRatings[req.user_id]?.toFixed(2)
                                            }}/5)</span
                                          >
                                          <span v-else>No ratings yet</span>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>
                                    <v-card-actions class="my-2 d-flex justify-end">
                                      <v-btn
                                        class="text-none"
                                        rounded="xl"
                                        text="Close"
                                        @click="isActive.value = false"
                                      ></v-btn>
                                      <v-btn
                                        class="text-none"
                                        color="green"
                                        rounded="xl"
                                        text="Accept"
                                        variant="flat"
                                        @click="acceptRequest(req, isActive)"
                                      >
                                        Accept
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </template>
                              </v-dialog>
                            </v-btn>
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                        <br />
                      </template>
                    </v-list>
                    <div v-if="!loading && !requests.length" class="text-center">
                      No requests to display.
                    </div>
                  </v-window-item>
                </v-window>
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

.tight-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.3);
  transition: all 0.3s ease;
}

.v-tabs {
  margin-bottom: 16px;
}

.v-tab {
  text-transform: none;
  font-weight: 600;
}

.transparent-list {
  background: transparent !important;
  box-shadow: none !important;
}
.tab-icon {
  position: absolute;
  top: 9px;
  right: 16px;
}
</style>
