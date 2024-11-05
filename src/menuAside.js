import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiSquareEditOutline,
  mdiCertificateOutline,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiAccountMultiplePlus
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
    to: '/forms',
    label: 'Library',
    icon: mdiSquareEditOutline
  },
  {
    to: '/blogs',
    label: 'Blogs',
    icon: mdiTelevisionGuide
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/responsive',
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
