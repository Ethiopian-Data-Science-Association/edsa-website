import { getField, updateField } from 'vuex-map-fields'
import { db } from '@/firebase/firebaseInit'
import { doc, setDoc, getDocs, collection } from 'firebase/firestore'

const state = {
  resources: [],
  ResourceData: {}
}

const actions = {
  async addResource({ commit }, resource) {
    try {
      await setDoc(doc(db, 'resources', resource.id), resource)
      commit('updateField', {
        path: 'ResourceData',
        value: resource
      })
    } catch (error) {
      console.error('Error adding resource:', error)
    }
  },
 
  // Fetches all Resources
  async fetchResources({ commit }) {
    try {
      const querySnapshot = await getDocs(collection(db, 'resources'))
      const resources = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      commit('updateField', {
        path: 'resources',
        value: resources
      })
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  },

}

const mutations = {
  updateField, 
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
