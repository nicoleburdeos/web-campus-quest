<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const router = useRouter()
const { smAndDown, mdAndDown } = useDisplay() // Add mdAndDown for iPad detection

const userData = ref({
  email: '',
  fullname: '',
})

// Computed property for navigation type
const useBottomNav = computed(() => {
  // Use bottom nav for mobile and iPad Pro in portrait
  return smAndDown.value || (mdAndDown.value && window.innerHeight > window.innerWidth)
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
  userData.value.fullname = `${metadata.firstname} ${metadata.lastname}`
}

onMounted(() => {
  getUser()
})

const navItems = [
  { title: 'New Task', icon: 'mdi-plus', to: '/new-task' },
  { title: 'Task Board', icon: 'mdi-clipboard-text', to: '/task-board' },
  { title: 'On Going Task', icon: 'mdi-clipboard-clock-outline', to: '/ongoing-task' },
  { title: 'Personal Account', icon: 'mdi-account', to: '/profile' },
]
</script>

<template>
  <!-- Side Navigation (Desktop & iPad Pro Landscape) -->
  <v-navigation-drawer
    v-if="!useBottomNav"
    v-model="drawer"
    color="green-darken-4"
    expand-on-hover
    rail
    app
    width="256"
    :rail-width="80"
    class="nav-drawer"
  >
    <v-list class="pt-4">
      <v-list-item
        prepend-avatar="/public/images/cq-logo.png"
        :subtitle="userData.email"
        title="CAMPUS QUEST"
      >
        <!-- Add custom avatar size -->
        <template #prepend>
          <v-avatar size="48" class="my-2">
            <v-img src="/public/images/cq-logo.png" alt="Campus Quest Logo"></v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4"></v-divider>

    <v-list nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :title="item.title"
        :to="item.to"
        class="py-3 px-2 nav-item"
      >
        <template #prepend>
          <v-icon size="38" class="me-4 nav-icon">{{ item.icon }}</v-icon>
        </template>
      </v-list-item>

      <v-list-item title="Log Out" @click="onLogout" class="py-3 px-2 nav-item">
        <template #prepend>
          <v-icon size="38" class="me-4 nav-icon">mdi-logout</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Bottom Navigation (Mobile & iPad Pro Portrait) -->
  <v-bottom-navigation
    v-else
    app
    color="green-darken-4"
    grow
    :height="mdAndDown ? '80' : '72'"
    class="mobile-nav"
    :elevation="8"
  >
    <v-btn
      v-for="item in navItems"
      :key="item.title"
      :to="item.to"
      :value="item.title"
      class="mobile-nav-btn"
    >
      <div class="d-flex flex-column align-center">
        <v-icon size="28" class="mb-1">{{ item.icon }}</v-icon>
        <span class="mobile-nav-text">{{ item.title }}</span>
      </div>
    </v-btn>

    <v-btn @click="onLogout" value="logout" class="mobile-nav-btn">
      <div class="d-flex flex-column align-center">
        <v-icon size="28" class="mb-1">mdi-logout</v-icon>
        <span class="mobile-nav-text">Logout</span>
      </div>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.nav-drawer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-drawer:hover {
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
}

.v-navigation-drawer--expand-on-hover:hover {
  transform: translateX(0);
}

.nav-item {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-item:hover .nav-icon {
  transform: scale(1.2);
  color: #4caf50;
}

.nav-icon {
  transition: all 0.3s ease;
}

.nav-btn {
  transition: all 0.3s ease;
}

.nav-btn:hover {
  transform: translateY(-4px);
}

.nav-btn:active {
  transform: translateY(0);
}

.nav-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item:hover::after {
  opacity: 1;
}

.mobile-nav {
  background-color: rgb(27, 94, 32) !important; /* Same as green-darken-4 */
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-nav-btn {
  color: white !important;
}

.mobile-nav-text {
  color: rgba(255, 255, 255, 0.87);
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  text-align: center;
  margin-top: 2px;
}

.mobile-nav-btn.v-btn--active {
  background: rgba(255, 255, 255, 0.12);
}

.mobile-nav-btn.v-btn--active .v-icon,
.mobile-nav-btn.v-btn--active .mobile-nav-text {
  color: #4caf50;
  font-weight: 500;
}

.mobile-nav-btn .v-icon,
.mobile-nav-text {
  transition: all 0.2s ease;
}

.mobile-nav-btn:active {
  transform: scale(0.95);
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-nav {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(72px + env(safe-area-inset-bottom));
  }
}

/* iPad Pro Portrait Specific Styles */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .mobile-nav {
    height: 80px;
  }

  .mobile-nav-btn {
    padding: 12px 0;
  }

  .mobile-nav-text {
    font-size: 13px;
    margin-top: 4px;
  }

  .mobile-nav-btn .v-icon {
    font-size: 32px !important;
  }
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .mobile-nav {
      padding-bottom: env(safe-area-inset-bottom);
      height: calc(80px + env(safe-area-inset-bottom));
    }
  }
}
</style>
