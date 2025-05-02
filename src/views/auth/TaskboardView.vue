<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'

const { mobile } = useDisplay()
const currentTab = ref(0)

const tasks = ref([])
const requests = ref([])
const loading = ref(false)
const error = ref('')

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

// Fetch requests from Supabase
const fetchRequests = async () => {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('task_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (!fetchError) requests.value = data
  loading.value = false
}

onMounted(() => {
  fetchTasks()
  fetchRequests()
})

const requestItems = Array.from({ length: 4 }, (k, v) => v + 1)

const requestTask = async (task, isActive) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const fullname =
    `${user.user_metadata.firstname || ''} ${user.user_metadata.lastname || ''}`.trim()
  const phone = user.user_metadata.phone || ''
  const ratings = user.user_metadata.ratings || 'N/A'

  // Insert a new request for this task
  const { error } = await supabase.from('task_requests').insert([
    {
      task_id: task.id,
      user_id: user.id,
      fullname,
      phone,
      ratings,
    },
  ])

  if (!error) {
    isActive.value = false
    await fetchRequests()
  }
}
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-main>
        <div class="main-content">
          <v-col cols="12" md="6" lg="6">
            <v-card class="mx-auto glass-card" elevation="0">
              <v-img src="/images/cq-logo.png" :height="mobile ? '100' : '70'"></v-img>
              <v-tabs v-model="currentTab" color="green-darken-4" align-tabs="center" grow>
                <v-tab :value="0">Task Quest</v-tab>
                <v-tab :value="1">Task Requests</v-tab>
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
                        <v-list-item
                          :title="req.fullname"
                          :subtitle="`${new Date(req.created_at).toLocaleTimeString()}`"
                        >
                          <template #prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>
                          <template #append>
                            <v-btn icon variant="plain" size="small" class="info-btn">
                              <v-icon>mdi-information</v-icon>
                              <v-dialog activator="parent" max-width="500">
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
                                        <h1>Requested by: <br> {{ req.fullname }}</h1>
                                      </div>
                                      <div class="mb-2">Task ID: #{{ req.task_id }}</div>

                                      <v-row class="tight-row">
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Phone:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{ req.phone }}</v-col>
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0">
                                          Ratings:
                                        </v-col>
                                        <v-col cols="6" class="py-1 px-0">{{ req.ratings }}</v-col>
                                      </v-row>
                                    </v-card-text>
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
</style>
