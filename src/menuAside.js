import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiSquareEditOutline,
  mdiCertificateOutline,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiAccountMultiplePlus,
  mdiPost
} from '@mdi/js'

export default [
  {
    to: '/',
    icon: mdiMonitor,
    label: 'Home'
  },
  {
    to: '/memberships',
    label: 'Memberships',
    icon: mdiAccountMultiplePlus
  },
  {
    to: '/certifications',
    label: 'Certifications',
    icon: mdiCertificateOutline
  },
  {
    to: '/library',
    label: 'Library',
    icon: mdiSquareEditOutline
  },
  {
    to: '/blogs',
    label: 'Blogs',
    icon: mdiTelevisionGuide
  },
  {
    to: '/blogs/my-blogs',
    label: 'My Blogs',
    icon: mdiPost
  },
  /* Uncomment this section whenever you would like to see the reusable components.*/
  // {
  //   to: '/ui',
  //   label: 'UI',
  //   icon: mdiTelevisionGuide
  // },
  {
    to: '/jobs',
    label: 'Jobs',
    icon: mdiResponsive
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  }
]
