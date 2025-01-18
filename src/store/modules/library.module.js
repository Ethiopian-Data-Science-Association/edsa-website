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
  resources: [],
  ResourceData: {},
  lastVisible: null // Track the last fetched document
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
 
  // Fetch paginated resources
  async fetchResources({ commit }, { reset = false }) {
    try {
      if (reset) {
        commit('resetResources')
      }

      const resourcesQuery = state.lastVisible
        ? query(
            collection(db, 'resources'),
            orderBy('title'), // Replace 'title' with the appropriate field in your database
            startAfter(state.lastVisible),
            limit(10)
          )
        : query(collection(db, 'resources'), orderBy('title'), limit(10))

      const querySnapshot = await getDocs(resourcesQuery)

      state.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] // Update last visible document

      const resources = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      commit('appendResources', resources)
    } catch (error) {
      console.error('Error fetching resources with pagination:', error)
    }
  },
  async deleteResource({ commit }, id) {
    try {
      // Reference the specific document in the 'resources' collection
      const resourceRef = doc(db, "resources", id);
  
      // Delete the document
      await deleteDoc(resourceRef);
  
      // Fetch the updated list of resources
      const querySnapshot = await getDocs(collection(db, "resources"));
      const updatedResources = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Update the resources in the state
      commit("updateField", {
        path: "resources",
        value: updatedResources,
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  }  
}

const mutations = {
  updateField,
  appendResources(state, newResources) {
    state.resources = [...state.resources, ...newResources]
  },
  resetResources(state) {
    state.resources = []
    state.lastVisible = null // Reset pagination
  }
}

const getters = {
  getField,
  resources: (state) => state.resources
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
