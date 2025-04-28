<script setup>
import DashboardView from './DashboardView.vue'
import { ref } from 'vue'

</script>

<template>
  <DashboardView>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="profile-card pa-6" elevation="1">
            <v-row>
              <!-- Left side and Basic Info -->
              <v-col cols="12" md="3" class="d-flex flex-column align-center justify-center">
                <v-avatar size="100" class="mb-3">
                  <v-img src="/images/cq-logo.png" alt="User avatar"></v-img>
                </v-avatar>
                <div class="text-h6 font-weight-bold mb-1">Jannie Regel</div>
                <div class="mb-1">
                  <v-rating value="5" color="amber" dense readonly size="18"></v-rating>
                  <span class="ml-1 grey--text text--darken-1">214 rates</span>
                </div>
                <v-progress-linear
                  value="85"
                  height="8"
                  color="primary"
                  rounded
                  class="mb-1"
                ></v-progress-linear>
                <div class="caption grey--text">85% trust</div>
              </v-col>
              <v-divider vertical></v-divider>
              <!-- Right side Details -->
              <v-col cols="12" md="9">
                <v-row>
                  <!-- User profile -->
                  <v-col cols="12" md="12" class="pb-0">
                    <div class="font-weight-bold mb-2"><h2>User profile</h2></div> 
         
                    <br><br>
    

                    <v-row>
                      <v-col cols="4"
                        ><span class="text-medium-emphasis py-1 px-0">Email:</span>
                        <span class="font-weight-bold mb-2"> evangelistajosh@gmailcom</span></v-col
                      >

                      <v-col cols="4"
                        ><span class="text-medium-emphasis py-1 px-0">Gender:</span>
                        <span class="font-weight-bold mb-2"> Female</span></v-col
                      >
                 
                      <v-col cols="4"
                        ><span class="text-medium-emphasis py-1 px-0">Mobile Number:</span>
                        <span class="font-weight-bold mb-2"> 091134325</span></v-col
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DashboardView>
</template>

<style scoped>
.profile-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  letter-spacing: -1px;
}
.profile-card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(60, 60, 60, 0.07);
}
.profile-link {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}
</style>
