<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const drawer = ref(true)
const router = useRouter()
const { smAndDown } = useDisplay()

const userData = ref({
  email: '',
  fullname: '',
})

// Logout Functionality
const onLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.replace('/')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Getting User Information Functionality
const getUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const metadata = user.user_metadata
    userData.value.email = user.email || metadata?.email || ''
    userData.value.fullname = `${metadata?.firstname || ''} ${metadata?.lastname || ''}`.trim()
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

onMounted(() => {
  getUser()
})

// Menu items configuration
const menuItems = computed(() => [
  { title: 'New Task', icon: 'mdi-plus', to: '/new-task' },
  { title: 'Task Board', icon: 'mdi-clipboard-text', to: '/task-board' },
  { title: 'Recent Task', icon: 'mdi-history', to: '/recent-task' },
  { title: 'Personal Account', icon: 'mdi-account', to: '/profile' },
  { title: 'Log Out', icon: 'mdi-logout', action: onLogout },
])
</script>

<template>
  <!-- Desktop Navigation (hidden on mobile) -->
  <v-navigation-drawer
    v-if="!smAndDown"
    v-model="drawer"
    color="green-darken-4"
    permanent
    rail
    expand-on-hover
    width="280"
    rail-width="80"
    app
  >
    <v-list>
      <v-list-item class="py-4">
        <template v-slot:prepend>
          <v-avatar size="45" class="logo-avatar">
            <v-img src="/images/cq-logo.png" cover></v-img>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">CAMPUS QUEST</v-list-item-title>
        <v-list-item-subtitle>{{ userData.email || 'Loading...' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider class="my-2"></v-divider>

    <v-list nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :value="item.to"
        :to="item.to"
        @click="item.action && item.action()"
        class="my-1"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Mobile Bottom Navigation (hidden on desktop) -->
  <v-bottom-navigation v-if="smAndDown" app color="green-darken-4" grow height="64">
    <v-btn
      v-for="item in menuItems"
      :key="item.title"
      :value="item.to"
      :to="item.action ? undefined : item.to"
      @click="item.action && item.action()"
      height="100%"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
/* Desktop Navigation Styles */
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
}

.v-list-item {
  border-radius: 8px;
  margin: 4px 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.v-list-item--active {
  background: rgba(255, 255, 255, 0.15);
}

/* Mobile Navigation Styles */
.v-bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.v-bottom-navigation .v-btn {
  flex-direction: column;
  min-width: auto;
}

.v-bottom-navigation .v-btn span {
  font-size: 0.75rem;
  margin-top: 4px;
}

/* Ensure content doesn't hide behind bottom nav on mobile */
@media (max-width: 959px) {
  .content-wrapper {
    padding-bottom: 64px;
  }
}
</style>
