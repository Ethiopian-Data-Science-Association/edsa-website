// store/index.js
import { createStore } from 'vuex'
import * as modules from './modules'
import localforage from 'localforage'

export const store = createStore({
  modules, // all modules in store
  mutations: {
    // Configure Localforage on App Loading . Added localstorage as a fallback option
    setLocalforageConfig: () => {
      localforage.config({
        driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
        name: 'EDSA'
      })
      localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE])
    },
    // persist Auth Stored Data
    persistAuth: (state) => {
      localforage.setItem('auth', state.auth).catch((error) => console.error(error))
    },
    // persist User data if change happens like new project creation
    persistUser: (state) => {
      localforage.setItem('user', state.user).catch((error) => console.error(error))
    },
    // Un-Persist all data in IndexDb meaning remove all data in store on logout
    unpersistAll: () => {
      localforage.iterate(function (value, key) {
        localforage
          .removeItem(`${key}`)
          .then(() =>
            localforage
              .clear()
              .then(() => location.reload(true)) // reload from server set to true
              .catch((error) => {
                console.error(error)
              })
          )
          .catch((error) => console.error(error))
      })
    }
  }
})
