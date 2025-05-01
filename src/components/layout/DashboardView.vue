<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const router = useRouter()

const userData = ref ({
  email: '',
  fullname: ' '
})

// Logout Functionality 
const onLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    return
  }
  router.replace('/')
}

// Getting User Information Functionality
const getUser = async () => {
  const { 
    data: {
      user: { user_metadata: metadata }
    } 
  } = await supabase.auth.getUser()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.firstname + ' ' + metadata.lastname
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <v-row>
          <!-- Navigation Drawer -->
          <v-col cols="12" md="4">
            <!-- Mobile Nav Toggle Button -->
            <v-btn
              class="d-md-none mb-2"
              icon
              @click="drawer = !drawer"
              color="green-darken-4"
              style="position: absolute; top: 16px; left: 16px; z-index: 10"
            >
              <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
            </v-btn>
            <br />
            <v-navigation-drawer
              v-model="drawer"
              color="green-darken-4"
              expand-on-hover
              rail
              app
              :temporary="$vuetify.display.smAndDown"
            >
              <v-list>
                <v-list-item
                  prepend-avatar="public/images/cq-logo.png"
                  :subtitle="userData.email"
                  title="CAMPUS QUEST"
                ></v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-plus "
                  title="New Task"
                  value="newtask"
                  to="/new-task"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-clipboard-text"
                  title="Task Board"
                  value="taskboard"
                  to="/task-board"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-history"
                  title="Recent Task"
                  value="recentTask"
                  to="/recent-task"
                ></v-list-item>

                <v-list-item
                  prepend-icon="mdi-account"
                  title="Personal Account"
                  value="personalAccount"
                  to="/profile"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-logout"
                  title="Log Out"
                  value="log out"
                  @click="onLogout"
                ></v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-col>

          <v-main>
            <v-container>
              <slot />
            </v-container>
          </v-main>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
