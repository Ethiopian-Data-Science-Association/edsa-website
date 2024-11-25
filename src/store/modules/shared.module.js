import { getField, updateField } from 'vuex-map-fields'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

const state = {
  documentPath: '',
  uploadingDocument: false,
  deletingDocument: false
}

const actions = {
  async uploadDocument({ commit }, { payload }) {
    commit('updateField', { path: 'uploadingDocument', value: true })
    try {
      const storage = getStorage() // Initialize Firebase storage
      const storageRef = ref(storage, `/uploads/${payload.documentStoragePath}`)
      const uploadTask = uploadBytesResumable(storageRef, payload.document, payload.metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // 'Upload is ' + progress + '% done'
          switch (snapshot.state) {
            case 'paused':
              // 'Upload is paused'
              break
            case 'running':
              // 'Upload is running'
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update state with the document URL
            commit('updateField', { path: 'documentPath', value: downloadURL })
          })
        }
      )
    } catch (error) {
      console.error('Error uploading document:', error)

      // Clear document path on error
      commit('updateField', { path: 'documentPath', value: '' })
    } finally {
      commit('updateField', { path: 'uploadingDocument', value: false })
    }
  },

  async removeDocument({ commit }, { payload }) {
    commit('updateField', { path: 'deletingDocument', value: true })

    try {
      const storage = getStorage() // Initialize Firebase storage
      const storageRef = ref(storage, `/uploads/${payload.documentUrl}/${payload.documentName}`)

      // Delete the document
      await deleteObject(storageRef)

      // Clear the document path
      commit('updateField', { path: 'documentPath', value: '' })
    } catch (error) {
      console.error('Error deleting document:', error)

      // Optionally: Notify user of failed deletion
    } finally {
      commit('updateField', { path: 'deletingDocument', value: false })
    }
  },

  clearDocumentPath({ commit }) {
    commit('updateField', { path: 'documentPath', value: '' })
  }
}

const mutations = {
  updateField
}

const getters = {
  getField,
  uploadingDocument: (state) => state.uploadingDocument,
  deletingDocument: (state) => state.deletingDocument,
  documentPath: (state) => state.documentPath
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
