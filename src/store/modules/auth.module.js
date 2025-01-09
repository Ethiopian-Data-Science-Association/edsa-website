import { getField, updateField } from 'vuex-map-fields'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth'
import { roles } from '@/shared/constants/roles'
import { store } from '../index'

const state = {
  userId: null,
  userAuthenticated: false,
  authToken: null,
  refreshToken: null,
  fetchedUserData: null
}

const actions = {
  async signUpUser({ commit }, payload) {
    const auth = getAuth()
    try {
      const response = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      const { user } = response
      // Prepare user data for Firestore, replacing undefined values with empty strings
      const userData = {
        email: user.email,
        fullName: payload.name,
        phoneNumber: payload.phoneNumber || '',
        uid: user.uid,
        bio: '',
        city: payload.city || '',
        country: payload.country || '',
        profilePicture: '',
        role: roles.REGULAR, // default value
        certifications: [] // this will contain the certifications registered/taken
      }
      commit('updateField', { path: 'user', value: userData })
      await store.dispatch('user/addUser', userData, { root: true })
      console.info('Successfully registered! Please login.')
      return user
    } catch (error) {
      alert(error.message)
    }
  },

  async sendPasswordResetEmail({}, { reset }) {
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, reset.email)
    } catch (error) {
      console.error(error)
    }
  },

  async signUpUserWithGoogle({ commit }, payload) {
    try {
      const userData = {
        email: payload.email,
        fullName: payload.name,
        phoneNumber: payload.phoneNumber || '',
        uid: payload.uid,
        bio: '',
        city: payload.city || '',
        country: payload.country || '',
        profilePicture: '',
        role: roles.REGULAR, // default value
        certifications: [] // this will contain the certifications registered/taken
      }
      commit('updateField', { path: 'user', value: userData })
      await store.dispatch('user/addUser', userData, { root: true })
      console.info('Successfully registered! Please login.')
      return userData
    } catch (error) {
      alert(error.message)
    }
  },

  async updatePassword({ commit }, { currentPassword, newPassword, confirmNewPassword }) {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error("Passwords don't match")
      }

      if (currentPassword === newPassword) {
        return
      }

      const auth = getAuth()

      const user = auth.currentUser

      await createUserWithEmailAndPassword(auth, user.email, currentPassword)

      await updatePassword(user, newPassword)
    } catch (error) {
      console.error('Error updating password:', error)
      throw new Error("Error updating password")
    }
  }
}

const mutations = {
  updateField,
  setUserData(state, payload) {
    state.userId = payload.userId
    state.userAuthenticated = payload.userAuthenticated
    state.authToken = payload.authToken
    state.refreshToken = payload.refreshToken
    state.fetchedUserData = payload.fetchedUserData
  }
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
