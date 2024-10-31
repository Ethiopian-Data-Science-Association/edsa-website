import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { doc, setDoc } from 'firebase/firestore'
import localforage from 'localforage'

const state = {
  user: {}
}

const actions = {
  async hydrateUser() {
    const value = await localforage.getItem('user')
    if (value) {
      /* Flush out state values and reassign */
      state.user = {}

      /* Hydrate Users */
      state.user = value.user
    }
  },

  async addUser({ commit }, user) {
    // Add user information to Firestore on sign up
    try {
      await setDoc(doc(db, 'users', user.uid), user)
    } catch (error) {
      console.error('Error adding user to Firestore:', error)
    }
    // Commit the payload to Vuex state
    commit('updateField', {
      path: 'user',
      value: user // Use the sanitized user data
    })
  }
}

const mutations = {
  updateField
}

const getters = {
  getField
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
