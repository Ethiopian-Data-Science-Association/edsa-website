import { db } from '@/firebase/firebaseInit'
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  doc,
  limit,
  orderBy,
  startAfter
} from 'firebase/firestore'
import { store } from '../index'
import { getField, updateField } from 'vuex-map-fields'

const state = {
  jobs: [],
  singleJob: {},
  lastVisible: null // Pagination tracking
}

const actions = {
  // **Add a new job post**
  async addJob({ commit }, job) {
    try {
      await setDoc(doc(db, 'jobs', job.id), {
        ...job,
        isApproved: false, // Default: Pending approval
        isDeclined: false, // not declined 
        isClosed: false, // Default: Open
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: job.createdBy // Store the User ID of the creator
      })
      commit('updateField', {
        path: 'singleJob',
        value: job
      })
    } catch (error) {
      console.error('Error adding job:', error)
    }
  },

  // **Fetch paginated jobs**
  async fetchJobs({ commit }, { reset = false, isAdmin = false }) {
    try {
      if (reset) {
        commit('resetJobs')
      }

      let jobsQuery = query(
        collection(db, 'jobs'),
        where('isApproved', '==', true),
        where('isClosed', '==', false),
        orderBy('createdAt', 'desc'),
        limit(10)
      )

      // If admin, fetch all jobs including unapproved ones
      if (isAdmin) {
        jobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(10))
      }

      const querySnapshot = await getDocs(jobsQuery)
      const jobs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      commit('appendJobs', jobs)
      if (querySnapshot.docs.length > 0) {
        state.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  },

  // **Approve a job**
  async approveJob({ commit }, jobId) {
    try {
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        isApproved: true,
        isDeclined: false,
        updatedAt: Date.now()
      })

      commit('updateJobStatus', { jobId, status: 'approved' })
    } catch (error) {
      console.error('Error approving job:', error)
    }
  },

  // **Decline a job**
  async declineJob({ commit }, jobId) {
    try {
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        isApproved: false,
        isDeclined: true,
        updatedAt: Date.now()
      })

      commit('updateJobStatus', { jobId, status: 'declined' })
    } catch (error) {
      console.error('Error declining job:', error)
    }
  },

  // **Close a job posting (not delete, just mark as closed)**
  async closeJob({ commit }, closeData) {
    try {
      // Fetch user role from firestore
      const userRole = await store.dispatch('user/getUserAcl', {
        uid: closeData.userId,
        email: closeData.email
      }) // get the correct the ACL

      const jobRef = doc(db, 'jobs', closeData.jobId)
      const jobSnap = await getDoc(jobRef)

      if (jobSnap.exists()) {
        const jobData = jobSnap.data() // Extract data properly
        if (jobData.createdBy !== closeData.userId && userRole !== 'ADMIN') {
          console.error('Unauthorized: Only the creator or an admin can close this job.')
          return
        }
        // else close the job by the user or the admin
        await updateDoc(jobRef, {
          isClosed: true,
          updatedAt: Date.now()
        })

        commit('updateJobStatus', { jobId, status: 'closed' })
      } else {
        console.error('Job not found.')
        return
      }

      // Update job status
      await updateDoc(jobRef, {
        isClosed: true,
        updatedAt: Date.now()
      })

      commit('updateJobStatus', { jobId, status: 'closed' })
    } catch (error) {
      console.error('Error closing job:', error)
    }
  }
}

const mutations = {
  updateField,

  // Append new jobs to state
  appendJobs(state, newJobs) {
    state.jobs = [...state.jobs, ...newJobs]
  },

  // Reset job listings
  resetJobs(state) {
    state.jobs = []
    state.lastVisible = null
  },

  updateJobStatus(state, { jobId, status }) {
    if (!state.jobs || state.jobs.length === 0) return // Prevent undefined errors
    const jobIndex = state.jobs.findIndex((job) => job.id === jobId)
    if (jobIndex !== -1) {
      if (status === 'approved') {
        state.jobs[jobIndex].isApproved = true
      } else if (status === 'declined') {
        state.jobs[jobIndex].isApproved = false
      } else if (status === 'closed') {
        state.jobs[jobIndex].isClosed = true
      }
    }
  }
}

const getters = {
  getField,
  jobs: (state) => state.jobs
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
