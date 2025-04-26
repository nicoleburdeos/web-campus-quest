import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/auth/DashboardView.vue'
import NewView from '@/views/NewView.vue'
import TaskBoardView from '@/views/auth/TaskboardView.vue'
import RecentTaskView from '@/views/auth/RecentTaskView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/new-task',
      name: 'new-task',
      component: NewView,
    },

    {
      path: '/task-board',
      name: 'task-board',
      component: TaskBoardView,
    },

    {
      path: '/recent-task',
      name: 'recent-task',
      component: RecentTaskView,
    },
  ],
})

export default router
