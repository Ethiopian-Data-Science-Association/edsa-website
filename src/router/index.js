import { createRouter, createWebHashHistory } from 'vue-router'
import Memberships from '@/views/Memberships.vue'
import CertificationDetail from '@/views/CertificationDetail.vue'
import Home from '@/views/HomeView.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import TermsAndConditions from '@/views/TermsAndConditions.vue'

const routes = [
  {
    meta: {
      title: 'Home'
    },
    path: '/',
    name: 'home',
    component: Home
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Memberships'
    },
    path: '/memberships',
    name: 'memberships',
    component: Memberships
  },
  {
    path: '/certifications/:title',
    name: 'CertificationDetail',
    component: CertificationDetail,
  },
  {
    meta: {
      title: 'PrivacyPolicy'
    },
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicy
  },
  {
    meta: {
      title: 'TermsAndConditions'
    },
    path: '/terms-and-conditions',
    name: 'terms-and-conditions',
    component: TermsAndConditions
  },
  {
    meta: {
      title: 'Certifications'
    },
    path: '/certifications',
    name: 'certifications',
    component: () => import('@/views/CertificationsPage.vue')
  },
  // {
  //   meta: {
  //     title: 'CertificationDetail'
  //   },
  //   path: '/certifications/:id',
  //   name: 'certification-detail',
  //   component: () => import('@/views/CertificationDetail.vue')
  // },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'RegularMembershipForm'
    },
    path: '/regular-membership-form',
    name: 'regular-membership-form',
    component: () => import('@/views/RegularMembershipForm.vue')
  },
  {
    meta: {  
      title: 'InstitutionMembershipForm'
    },
    path: '/institution-membership-form',
    name: 'institution-membership-form',
    component: () => import('@/views/InstitutionMembershipForm.vue')
  },
  {
    meta: {
      title: 'About'
    },
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
