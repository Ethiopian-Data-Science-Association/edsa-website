import { getField, updateField } from 'vuex-map-fields';
import { db } from '@/firebase/firebaseInit';
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, arrayUnion } from 'firebase/firestore';


const state = {
  certifications: [],
  certificationData: {}
};

const actions = {
  async addCertification({ commit }, certification) {
    try {
      // Create a new certification in Firestore
      await setDoc(doc(db, 'certifications', certification.id), certification);
      commit('updateField', {
        path: 'certificationData',
        value: certification
      });
    } catch (error) {
      console.error('Error adding certification:', error);
    }
  },

  async fetchCertification({ commit }, certificationId) {
    try {
      const docRef = doc(db, 'certifications', certificationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        commit('updateField', {
          path: 'certificationData',
          value: docSnap.data()
        });
      } else {
        console.log('No such certification!');
      }
    } catch (error) {
      console.error('Error fetching certification:', error);
    }
  },
  async fetchCertifications({ commit }) {
    try {
      const querySnapshot = await getDocs(collection(db, 'certifications'));
      const certifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setCertifications', certifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    }
  },

  async registerForCertification({ commit }, { userId, certificationId }) {
    try {
      const certificationRef = doc(db, 'certifications', certificationId);
      await updateDoc(certificationRef, {
        registeredUsers: arrayUnion(userId)
      });
      console.log(`User ${userId} registered for certification ${certificationId}`);
    } catch (error) {
      console.error('Error registering for certification:', error);
    }
  },

  async updateCertification({ commit }, certification) {
    try {
      const docRef = doc(db, 'certifications', certification.id);
      await updateDoc(docRef, certification);

      // Update the Vuex store with the new certification data
      commit('updateField', {
        path: 'certificationData',
        value: certification
      });
    } catch (error) {
      console.error('Error updating certification:', error);
    }
  }
};

const mutations = {
  updateField,
  setCertifications(state, certifications) {
    state.certifications = certifications;
  }
};

const getters = {
  getField
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
