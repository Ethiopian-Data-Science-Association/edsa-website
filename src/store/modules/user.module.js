import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { store } from '..'
import { doc, setDoc } from 'firebase/firestore'
import localforage from 'localforage'

const state = {
  userData: {}
}

const actions = {
  async hydrateUser() {
    const value = await localforage.getItem('userData')
    if (value) {
      /* Flush out state values and reassign */
      state.userData = {}

      /* Hydrate Users */
      state.userData = value.userData
    }
  },

  async addUser({ commit }, user) {
    // Add user information to Firestore on sign up
    try {
      await setDoc(doc(db, 'users', user.uid), user).then(() => {
          // Set the user to the Vuex state before persisting
          commit('updateField', {
            path: 'userData',
            value: user
          })
          // persist User on the Index DB
          store.commit('persistUser')
      })
    } catch (error) {
      console.error('Error adding user information to Firestore:', error)
    }
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
