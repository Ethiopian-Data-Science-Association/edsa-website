import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  limit,
  orderBy,
  startAfter
} from 'firebase/firestore'

const state = {
  announcements: [],
  announcementData: {},
  lastVisible: null // Track the last fetched document
}

const actions = {
  async addAnnouncement({ commit }, announcement) {
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement)
      commit('updateField', {
        path: 'announcementData',
        value: announcement
      })
    } catch (error) {
      console.error('Error adding announcement:', error)
    }
  },

  // Fetch paginated announcements
  async fetchAnnouncements({ commit }, { reset = false, category = 'All' }) {
    try {
      if (reset) {
        commit('resetAnnouncements')
      }

      const pageSize = category === 'recent' ? 5 : 10

      const announcementsQuery = state.lastVisible
        ? query(
            collection(db, 'announcements'),
            orderBy('createdAt', 'desc'), // Ensure announcements are sorted by creation date
            startAfter(state.lastVisible),
            limit(pageSize)
          )
        : query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(pageSize))

      const querySnapshot = await getDocs(announcementsQuery)

      state.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] // Update last visible document

      const announcements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      commit('appendAnnouncements', announcements)
    } catch (error) {
      console.error('Error fetching announcements with pagination:', error)
    }
  },

  async deleteAnnouncement({ commit }, id) {
    try {
      // Reference the specific document in the 'announcements' collection
      const announcementRef = doc(db, 'announcements', id)

      // Delete the document
      await deleteDoc(announcementRef)

      // Fetch the updated list of announcements
      const querySnapshot = await getDocs(collection(db, 'announcements'))
      const updatedAnnouncements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      // Update the announcements in the state
      commit('updateField', {
        path: 'announcements',
        value: updatedAnnouncements
      })
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }
}

const mutations = {
  updateField,
  appendAnnouncements(state, newAnnouncements) {
    state.announcements = [...state.announcements, ...newAnnouncements]
  },
  resetAnnouncements(state) {
    state.announcements = []
    state.lastVisible = null // Reset pagination
  }
}

const getters = {
  getField,
  announcements: (state) => state.announcements
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
