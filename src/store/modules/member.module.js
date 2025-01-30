import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const state = {
  memberData: {},
  isMemberFetched: false
}

const actions = {
  /**
   * Check if a user has already registered for membership.
   * @param {string} uid - The user's unique ID.
   * @returns {boolean} - True if the membership exists, false otherwise.
   */
  async checkMembership(_, uid) {
    try {
      const docRef = doc(db, 'members', uid)
      const docSnap = await getDoc(docRef)

      return docSnap.exists() // Returns true if membership exists
    } catch (error) {
      console.error('Error checking membership:', error)
      return false
    }
  },

  /**
   * Add a new member to the 'members' collection in Firestore.
   * @param {Object} memberData - The membership data to be added.
   */
  async addMember({ commit }, memberData) {
    try {
      const docRef = doc(db, 'members', memberData.uid)

      // Ensure the membership does not already exist
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        throw new Error('User has already registered for membership.')
      }

      await setDoc(docRef, memberData)

      commit('updateField', { path: 'memberData', value: memberData })
      commit('setMemberFetched', true)
    } catch (error) {
      console.error('Error adding member:', error)
      throw error
    }
  }
}

const mutations = {
  updateField,
  setMemberFetched(state, value) {
    state.isMemberFetched = value
  }
}

const getters = {
  getField,
  memberData: (state) => state.memberData
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
