<script setup>
import DashboardView from '../../components/layout/DashboardView.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const currentTab = ref(0) // Add this to track active tab

const items = Array.from({ length: 6 }, (k, v) => v + 1)
const requestItems = Array.from({ length: 4 }, (k, v) => v + 1)
</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-main>
        <div class="main-content">
          <v-col cols="12" md="6" lg="6">
            <v-card class="mx-auto glass-card" elevation="0">
              <v-img src="/images/cq-logo.png" :height="mobile ? '100' : '70'"></v-img>

              <!-- Replace toggle switch with tabs -->
              <v-tabs v-model="currentTab" color="green-darken-4" align-tabs="center" grow>
                <v-tab :value="0">Task Quest</v-tab>
                <v-tab :value="1">Task Requests</v-tab>
              </v-tabs>

              <v-card-text>
                <v-window v-model="currentTab">
                  <!-- Task Quest Tab -->
                  <v-window-item :value="0">
                    <v-virtual-scroll :items="items" height="320" item-height="20">
                      <template v-slot:default="{ item }">
                        <v-list-item :subtitle="`Badge #${item}`" :title="'Task Name'">
                          <template v-slot:prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>
                          <template v-slot:append>
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
                                        <h1>Task Name: Pancake</h1>
                                      </div>
                                      <div class="mb-2">Task ID: #1233</div>

                                      <div class="text-medium-emphasis mb-1">
                                        User Name: Josh Evangelista
                                      </div>
                                      <br />
                                      <v-row class="tight-row">
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Pickup point:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">Kinaadman Bldg.</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Destination:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">Hiraya Bldg.</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Task Type:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">Food Delivery</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Payment Method:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">Cash On Delivery</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Quantity:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">1</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Service Fee:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">Php 12.00</v-col>
                                      </v-row>

                                      <br />

                                      <div class="mb-2">Message (optional)</div>
                                      <v-textarea
                                        :counter="300"
                                        class="mb-2"
                                        rows="2"
                                        variant="outlined"
                                        persistent-counter
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
                                        @click="isActive.value = false"
                                      ></v-btn>
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
                    </v-virtual-scroll>
                  </v-window-item>

                  <!-- Task Requests Tab -->
                  <v-window-item :value="1">
                    <v-virtual-scroll :items="requestItems" height="320" item-height="20">
                      <template v-slot:default="{ item }">
                        <v-list-item :subtitle="`Request #${item}`" :title="'Request Name'">
                          <template v-slot:prepend>
                            <v-icon color="primary">mdi-account-question</v-icon>
                          </template>
                          <template v-slot:append>
                            <v-btn icon variant="plain" size="small" class="info-btn">
                              <v-icon>mdi-information</v-icon>
                              <v-dialog activator="parent" max-width="500">
                                <template v-slot:default="{ isActive }">
                                  <v-card rounded="lg">
                                    <v-card-title class="d-flex justify-space-between align-center">
                                      <div class="d-flex align-center">
                                        <v-icon class="me-2">mdi-information</v-icon>
                                        <div class="text-h5 text-medium-emphasis ps-2">
                                          Personal Info
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
                                      <div class="d-flex align-center mb-4">
                                        <v-avatar size="64" class="mr-4">
                                          <v-img
                                            src="/images/img-poster.gif"
                                            alt="User avatar"
                                          ></v-img>
                                        </v-avatar>
                                        <div>
                                          <div class="text-medium-emphasis mb-2">
                                            <h1 class="mb-0">Name: Cj Dumags</h1>
                                          </div>
                                        </div>
                                      </div>
                                      <br />
                                      <v-row class="tight-row">
                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Contact Number:</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">09189232435</v-col>

                                        <v-col cols="6" class="text-medium-emphasis py-1 px-0"
                                          >Ratings</v-col
                                        >
                                        <v-col cols="6" class="py-1 px-0">10/10</v-col>
                                      </v-row>

                                      <br />
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
                                        text="Accept"
                                        variant="flat"
                                        @click="isActive.value = false"
                                      ></v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </template>
                              </v-dialog>
                              <!-- You can add a dialog here for requests if needed -->
                            </v-btn>
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                        <br />
                      </template>
                    </v-virtual-scroll>
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

/* Add these new styles for tabs */
.v-tabs {
  margin-bottom: 16px;
}

.v-tab {
  text-transform: none;
  font-weight: 600;
}
</style>
