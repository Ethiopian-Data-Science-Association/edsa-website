import { getField, updateField } from 'vuex-map-fields';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import localforage from 'localforage';
import { roles } from '@/shared/constants/roles';
import { store } from '../index';

const state = {
  userId: null,
  userAuthenticated: false,
  authToken: null,
  refreshToken: null,
  fetchedUserData: null
};

const actions = {
  async hydrateAuth({ commit }) {
    const value = await localforage.getItem('auth');
    if (value) {
      commit('setUserData', value);
    }
  },

  async signUpUser({ commit },   payload) {
    const auth = getAuth();
    try {
      const response = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
      const { user } = response; 
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
        role: roles.REGULAR  // default value
      };
      commit('updateField', { path: 'user', value: userData });
      await store.dispatch('user/addUser', userData, { root: true });
      console.info('Successfully registered! Please login.');
      return user; 
    } catch (error) {
      alert(error.message);
    }
  },

  async sendPasswordResetEmail({}, { reset }) {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, reset.email);
    } catch (error) {
      console.error(error);
    }
  }
};

const mutations = {
  updateField,
  setUserData(state, payload) {
    state.userId = payload.userId;
    state.userAuthenticated = payload.userAuthenticated;
    state.authToken = payload.authToken;
    state.refreshToken = payload.refreshToken;
    state.fetchedUserData = payload.fetchedUserData;
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