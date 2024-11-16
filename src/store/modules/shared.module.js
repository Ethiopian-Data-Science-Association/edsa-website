import { getField, updateField } from "vuex-map-fields";
import firebase from "firebase/app";
import "firebase/storage";

const state = {
  documentPath: "",
  uploadingDocument: false,
  deletingDocument: false,
};

const actions = {
  async uploadDocument({ commit }, { payload }) {
    commit("updateField", { path: "uploadingDocument", value: true });
    try {
      const storageRef = firebase.storage().ref(`/uploads${payload.documentUrl}${payload.documentName}`);
      const uploadTask = storageRef.put(payload.document, { contentType: payload.metadata });

      await uploadTask.then(async () => {
        const documentUrl = await storageRef.getDownloadURL();
        commit("updateField", { path: "documentPath", value: documentUrl });
      });
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      commit("updateField", { path: "uploadingDocument", value: false });
    }
  },

  async removeDocument({ commit }, { payload }) {
    commit("updateField", { path: "deletingDocument", value: true });
    try {
      const storageRef = firebase.storage().ref(`/uploads${payload.documentUrl}${payload.documentName}`);
      await storageRef.delete();
      commit("updateField", { path: "documentPath", value: "" });
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      commit("updateField", { path: "deletingDocument", value: false });
    }
  },

  clearDocumentPath({ commit }) {
    commit("updateField", { path: "documentPath", value: "" });
  },
};

const mutations = {
  updateField,
};

const getters = {
  getField,
  uploadingDocument: (state) => state.uploadingDocument,
  deletingDocument: (state) => state.deletingDocument,
  documentPath: (state) => state.documentPath,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
