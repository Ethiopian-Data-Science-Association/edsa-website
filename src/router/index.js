import { createRouter, createWebHistory } from 'vue-router'
import Memberships from '@/views/Memberships.vue'
import Home from '@/views/HomeView.vue'
import FAQ from '@/views/FAQ.vue'
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
    meta: {
      title: 'FAQ'
    },
    path: '/faq',
    name: 'faq',
    component: FAQ
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
  {
    meta: {
      title: 'Certification Detail'
    },
    path: '/certifications/:id',
    name: 'certification-detail',
    component: () => import('@/views/CertificationDetail.vue')
  },
  {
    meta: {
      title: 'Certification Create Form'
    },
    path: '/certification-create-form',
    name: 'certification-create-form',
    component: () => import('@/views/CertificationCreateForm.vue')
  },
  {
    meta: {
      title: 'Certification Edit Form'
    },
    path: '/certifications/edit/:id',
    name: 'certification-edit-form',
    component: () => import('@/views/CertificationEditForm.vue')
  },
  {
    meta: {
      title: 'Certification Register Form'
    },
    path: '/certifications/register/:id',
    name: 'certification-register-form',
    component: () => import('@/views/CertificationRegistration.vue')
  },
  {
    meta: {
      title: 'Library'
    },
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryPage.vue')
  },
  {
    meta: {
      title: 'Library Create Form'
    },
    path: '/library-create-form',
    name: 'library-create-form',
    component: () => import('@/views/LibraryResourceCreateForm.vue')
  },
  {
    meta: {
      title: 'Announcements'
    },
    path: '/announcements',
    name: 'announcements',
    component: () => import('@/views/AnnouncementPage.vue')
  },
  {
    meta: {
      title: 'Announcement Create Form'
    },
    path: '/announcement-create-form',
    name: 'announcement-create-form',
    component: () => import('@/views/AnnouncementCreateForm.vue')
  },
  {
    meta: {
      title: 'Blogs'
    },
    path: '/blogs',
    name: 'blogs',
    component: () => import('@/views/BlogsPage.vue')
  },
  {
    meta: {
      title: 'Write Blogs'
    },
    path: '/blogs/write',
    name: 'writeBlog',
    component: () => import('@/views/WriteBlog.vue')
  },
  {
    meta: {
      title: 'My Blogs'
    },
    path: '/blogs/my-blogs',
    name: 'myBlog',
    component: () => import('@/views/MyBlogsView.vue')
  },
  {
    meta: {
      title: 'Blog'
    },
    path: '/blogs/:id',
    name: 'blog',
    component: () => import('@/views/SingleBlog.vue')
  },
  {
    meta: {
      title: 'Jobs'
    },
    path: '/jobs',
    name: 'jobs',
    component: () => import('@/views/JobsPage.vue')
  },
  {
    meta: {
      title: 'Job Create Form'
    },
    path: '/job-create-form',
    name: 'job-create-form',
    component: () => import('@/views/JobCreateForm.vue')
  },
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
      title: 'Contacts'
    },
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/views/ContactsPage.vue')
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
      title: 'Signup'
    },
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupPage.vue')
  },
  {
    meta: {
      title: 'Forgot password'
    },
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue')
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
  history: createWebHistory('/edsa-website'), // The web Base URL attaches on each route
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
