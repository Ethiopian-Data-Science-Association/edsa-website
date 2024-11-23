import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, arrayUnion } from 'firebase/firestore'

const state = {
  certifications: [],
  certificationData: {}
}

const actions = {
  async addCertification({ commit }, certification) {
    try {
      await setDoc(doc(db, 'certifications', certification.id), certification)
      commit('updateField', {
        path: 'certificationData',
        value: certification
      })
    } catch (error) {
      console.error('Error adding certification:', error)
    }
  },

  // Fetches one certificate
  async fetchCertification({ commit }, certificationId) {
    try {
      const docRef = doc(db, 'certifications', certificationId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        commit('updateField', {
          path: 'certificationData',
          value: docSnap.data()
        })
      } else {
        alert('No such certification!')
      }
    } catch (error) {
      console.error('Error fetching certification:', error)
    }
  },

  // Fetches all Certifications
  async fetchCertifications({ commit }) {
    try {
      const querySnapshot = await getDocs(collection(db, 'certifications'))
      const certifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      commit('updateField', {
        path: 'certifications',
        value: certifications
      })
    } catch (error) {
      console.error('Error fetching certifications:', error)
    }
  },

  // Fetches only the user registered/paid certifications.
  async fetchCertificationsByIds({ commit }, ids) {
    try {
      const certifications = []
      for (const id of ids) {
        const docRef = doc(db, 'certifications', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          certifications.push({ id: docSnap.id, ...docSnap.data() })
        }
      }
      commit('updateField', {
        path: 'certifications',
        value: certifications
      })
    } catch (error) {
      console.error('Error fetching certifications by IDs:', error)
    }
  },

  async registerUserToCertification({ commit }, { certificationId, userId }) {
    try {
      const certificationRef = doc(db, 'certifications', certificationId)
      const userEntry = { uid: userId, status: 'Registered' }

      await updateDoc(certificationRef, {
        users: arrayUnion(userEntry)
      })
    } catch (error) {
      console.error('Error registering user to certification:', error)
    }
  },

  async updateCertification({ commit }, certification) {
    try {
      const docRef = doc(db, 'certifications', certification.id)
      await updateDoc(docRef, certification)

      commit('updateField', {
        path: 'certificationData',
        value: certification
      })
    } catch (error) {
      console.error('Error updating certification:', error)
    }
  }
}

const mutations = {
  updateField,
  setCertifications(state, certifications) {
    state.certifications = certifications
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
