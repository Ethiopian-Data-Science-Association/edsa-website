import { getField, updateField } from "vuex-map-fields";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const state = {
  documentPath: "",
  uploadingDocument: false,
  deletingDocument: false,
};

const actions = {
  async uploadDocument({ commit }, { payload }) {
    commit("updateField", { path: "uploadingDocument", value: true });

    try {
      const storage = getStorage(); // Initialize Firebase storage
      const storageRef = ref(storage, `/uploads/${encodeURIComponent(payload.documentUrl)}/${encodeURIComponent(payload.documentName)}`);

      // Upload the document
      await uploadBytes(storageRef, payload.document, { contentType: payload.metadata });

      // Retrieve the document's download URL
      const documentUrl = await getDownloadURL(storageRef);

      // Update state with the document URL
      commit("updateField", { path: "documentPath", value: documentUrl });
    } catch (error) {
      console.error("Error uploading document:", error);

      // Clear document path on error
      commit("updateField", { path: "documentPath", value: "" });
    } finally {
      commit("updateField", { path: "uploadingDocument", value: false });
    }
  },

  async removeDocument({ commit }, { payload }) {
    commit("updateField", { path: "deletingDocument", value: true });

    try {
      const storage = getStorage(); // Initialize Firebase storage
      const storageRef = ref(storage, `/uploads/${encodeURIComponent(payload.documentUrl)}/${encodeURIComponent(payload.documentName)}`);

      // Delete the document
      await deleteObject(storageRef);

      // Clear the document path
      commit("updateField", { path: "documentPath", value: "" });
    } catch (error) {
      console.error("Error deleting document:", error);

      // Optionally: Notify user of failed deletion
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
