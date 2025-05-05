<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import SideNavbarView from './SideNavbarView.vue'

const router = useRouter()

const userData = ref({
  email: '',
  fullname: ' ',
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
      user: { user_metadata: metadata },
    },
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
          <v-col cols="12" md="3" lg="2">
            <br />
            <SideNavbarView :onLogout="onLogout" :userData="userData"></SideNavbarView>
          </v-col>

          <v-col cols="12" md="9" lg="10">
            <v-container>
              <slot />
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
