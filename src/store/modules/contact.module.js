import { db } from '@/firebase/firebaseInit'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'

const state = {
  contacts: []
}

const actions = {
  // **Add Contact Submission**
  async addContactSubmission({ commit }, contactData) {
    debugger;
    try {
      await addDoc(collection(db, 'contacts'), {
        ...contactData,
        createdAt: Date.now()
      })
    } catch (error) {
      console.error('Error submitting contact request:', error)
    }
  },

  // **Fetch Contact Submissions in Descending Order**
  async fetchContacts({ commit }) {
    try {
      const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(contactsQuery)

      const contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      commit('setContacts', contacts)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }
}

const mutations = {
  setContacts(state, contacts) {
    state.contacts = contacts
  }
}

const getters = {
  contacts: (state) => state.contacts
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
