import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { store } from '../index'
import { roles } from '@/shared/constants/roles'
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const state = {
  userData: {},
  isUserFetched: false,
  isUserAclFetched: false,
  userFetchPromise: null,
  userAclFetchPromise: null
}

const actions = {
  async addUser({ commit }, user) {
    try {
      await setDoc(doc(db, 'users', user.uid), user).then(() => {
        commit('updateField', {
          path: 'userData',
          value: user
        })
        store.commit('persistUser') // for the localforage IndexDB persistence
      })
    } catch (error) {
      console.error('Error adding user information to Firestore:', error)
    }
  },

  // Add Access Control for security reasons
  async addAcl({ _ }, user) {
    try {
      const userAcl = { ...user, role: roles.REGULAR } // add the default Regular value for ACL
      await setDoc(doc(db, 'acl', user.uid), userAcl)
    } catch (error) {
      console.error('Error adding ACL information to Firestore:', error)
    }
  },

  async getUser({ commit, state }, userId) {
    if (state.isUserFetched) {
      return true
    }

    if (!state.userFetchPromise) {
      state.userFetchPromise = (async () => {
        try {
          const docRef = doc(db, 'users', userId)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            commit('updateField', {
              path: 'userData',
              value: docSnap.data()
            })
            commit('setUserFetched', true)
          } else {
            console.error('No such user!')
            return null
          }
          return true
        } catch (error) {
          console.error('Error fetching user data:', error)
          throw error
        }
      })()
    }

    return state.userFetchPromise
  },

  // Get the User ACL to display some Admin privilege things or not.
  async getUserAcl({ commit, state }, user) {
    // flush if it was fetched previously because we would like to fetch it again
    commit('setUserAclFetched', false)

    if (state.isUserAclFetched) {
      return true
    }

    if (!state.userAclFetchPromise) {
      state.userAclFetchPromise = (async () => {
        try {
          const docRef = doc(db, 'acl', user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            commit('setUserAclFetched', true)
          } else {
            // set a regular acl for this user since it is logging in using a pop-model with a provider
            await store.dispatch('user/addAcl', { uid: user.uid, email: user.email }) // set the correct the ACL
          }
          return docSnap?.data()?.role || roles.REGULAR // defaults to regular if there is no ACL for the user
        } catch (error) {
          console.error('Error fetching user data:', error)
          throw error
        }
      })()
    }

    return state.userAclFetchPromise
  },

  // Check the ACL for pop-users
  async checkUserAcl({ commit, state }, user) {
    if (state.isUserAclFetched) {
      return true
    }

    if (!state.userAclFetchPromise) {
      state.userAclFetchPromise = (async () => {
        try {
          // Check if the User exists , Get the user from firebase
          const userCheck = await store.dispatch('user/getUser', user.uid, { root: true }) // returns true or null

          // if null then add the user
          if (!userCheck) {
            const userData = {
              email: user.email,
              fullName: user?.displayName || '',
              phoneNumber: user?.phoneNumber || '',
              uid: user.uid,
              bio: '',
              city: user?.city || '',
              country: user?.country || '',
              profilePicture: user?.photoURL || '',
              certifications: []
            }
            await store.dispatch('user/addUser', userData, { root: true }) // add the user to firebase
          }
          const docRef = doc(db, 'acl', user.uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            commit('setUserAclFetched', true)
          } else {
            // set a regular acl for this user since it is logging in using a pop-model with a provider
            await store.dispatch('user/addAcl', { uid: user.uid, email: user.email }) // set the correct the ACL
          }
          return true
        } catch (error) {
          console.error('Error fetching user data:', error)
          throw error
        }
      })()
    }

    return state.userAclFetchPromise
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
  },

  async updateUserProfile({ commit }, profileForm) {
    try {
      // Check logged in user is the one making the edits
      const userFound = await store.dispatch('user/getUser', profileForm.uid, { root: true }) // returns true or null
      if (!userFound) {
        console.error('User ID is missing.')
        return
      }

      const userRef = doc(db, 'users', profileForm.uid)

      // Update only the fullName field
      await updateDoc(userRef, { fullName: profileForm.name })
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }
}

const mutations = {
  updateField,
  setUserFetched(state, value) {
    state.isUserFetched = value // Properly update the state
  },
  setUserAclFetched(state, value) {
    state.isUserAclFetched = value
  }
}

const getters = {
  getField,
  userData: (state) => state.userData
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
