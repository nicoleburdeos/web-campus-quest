<script setup>
import DashboardView from './DashboardView.vue'
import { ref } from 'vue'

const items = Array.from({ length: 6 }, (k, v) => v + 1)
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
                <h3 class="font-weight-black">Task Board</h3>
              </v-card-title>
              <!-- Example placeholder for tasks -->
              <v-card-text>
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
                                  <div class="text-h5 text-medium-emphasis ps-2">Task Info</div>
                                  <v-btn
                                    icon="mdi-close"
                                    variant="text"
                                    @click="isActive.value = false"
                                  ></v-btn>
                                </v-card-title>
                                <v-divider class="mb-4"></v-divider>
                                <v-card-text>
                                  <div class="text-medium-emphasis mb-4">
                                    Invite collaborators to your network and grow your connections.
                                  </div>
                                  <div class="mb-2">Message (optional)</div>
                                  <v-textarea
                                    :counter="300"
                                    class="mb-2"
                                    rows="2"
                                    variant="outlined"
                                    persistent-counter
                                  ></v-textarea>
                                  <div class="text-overline mb-2">💎 PREMIUM</div>
                                  <div class="text-medium-emphasis mb-1">
                                    Share with unlimited people and get more insights about your
                                    network. Try Premium Free for 30 days.
                                  </div>
                                  <v-btn
                                    class="text-none font-weight-bold ms-n4"
                                    color="primary"
                                    text="Retry Premium Free"
                                    variant="text"
                                  ></v-btn>
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
                        </v-btn>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <br />
                  </template>
                </v-virtual-scroll>
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
