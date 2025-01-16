import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { store } from '../index'
import { roles } from '@/shared/constants/roles'
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const state = {
  userData: {},
  isUserFetched: false,
  userFetchPromise: null
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
    return true;
  }

  if (!state.userFetchPromise) {
    state.userFetchPromise = (async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          commit('updateField', {
            path: 'userData',
            value: docSnap.data(),
          });

          commit('setUserFetched', true);
        } else {
          console.error('No such user!');
        }
        return true;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    })();
  }

  return state.userFetchPromise;
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
  updateField,
  setUserFetched(state, value) {
    state.isUserFetched = value; // Properly update the state
  },
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
