import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { store } from '../index'
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const state = {
  userData: {}
}

const actions = {
  async addUser({ commit }, user) {
    try {
      await setDoc(doc(db, 'users', user.uid), user).then(() => {
        commit('updateField', {
          path: 'userData',
          value: user
        })
        store.commit('persistUser') // for the localforage IndexDB persistance
      })
    } catch (error) {
      console.error('Error adding user information to Firestore:', error)
    }
  },

  async getUser({ commit }, userId) {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        commit('updateField', {
          path: 'userData',
          value: docSnap.data()
        })
      } else {
        console.error('No such user!')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  },

  async setUser({ commit }, user) {
    try {
      commit('updateField', {
        path: 'userData',
        value: user
      })
      store.commit('persistUser') // for the localforage IndexDB persistance
    } catch (error) {
      console.error('Error setting user information to Firestore:', error)
    }
  },

  async registerCertificationToUser({ _ }, { userId, certificationId }) {
    try {
      const userRef = doc(db, 'users', userId)
      const certificationEntry = { cid: certificationId, status: 'Registered' }

      await updateDoc(userRef, {
        certifications: arrayUnion(certificationEntry)
      })
    } catch (error) {
      console.error('Error registering certification to user:', error)
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
