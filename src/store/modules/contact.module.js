import { db } from '@/firebase/firebaseInit'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'

const state = {
  contactSubmissions: []
}

const actions = {
  // Add Contact Submission to Firestore
  async addContactSubmission(_, contactData) {
    try {
      await addDoc(collection(db, 'contacts'), {
        ...contactData,
        createdAt: Date.now() // Timestamp for sorting
      })
    } catch (error) {
      console.error('Error adding contact submission:', error)
    }
  },

  // Fetch Contact Submissions from Firestore (Descending Order)
  async fetchContactSubmissions({ commit }) {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const submissions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      commit('setContactSubmissions', submissions)
      return submissions
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      return []
    }
  }
}

const mutations = {
  setContactSubmissions(state, submissions) {
    state.contactSubmissions = submissions
  }
}

const getters = {
  contactSubmissions: (state) => state.contactSubmissions
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
