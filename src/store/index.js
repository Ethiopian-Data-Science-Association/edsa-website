import { createStore } from 'vuex'
import * as modules from './modules'
import localforage from 'localforage'

export const store = createStore({
  modules, // all modules in store
  mutations: {
    // Configure Localforage on App Loading . Added localstorage as a fallback option
    setLocalforageConfig: async () => {
      let driver = ''
      localforage
        .ready()
        .then(function () {
          // This code runs once localforage fully initialized the selected driver.
          driver = localforage.config()?.name // LocalStorage found
        })
        .catch(function (error) {
          console.error(error) // No available storage method found.
        })

      // Check if the driver is INDEXEDDB or LOCALSTORAGE is attched
      if (driver) {
        console.info('Driver is available and being used.')
      } else {
        localforage.config({
          driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
          name: 'EDSA'
        })
        localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE])
        localforage.setItem('driver', 1).catch((error) => console.error(error))
      }
    },
    // persist Auth Stored Data
    persistAuth: (state) => {
      localforage.setItem('auth', state.auth).catch((error) => console.error(error))
    },
    // persist User data if change happens like new project creation
    persistUser: (state) => {
      const serializedUser = {
        email: state.user.userData.email,
        fullName: state.user.userData.fullName || state.user.userData.displayName,
        phoneNumber: state.user.userData.phoneNumber || '', // Default to empty string if undefined
        uid: state.user.userData.uid,
        bio: state.user.userData.bio || '', // Default to empty string if undefined
        city: state.user.userData.city || '', // Default to empty string if undefined
        country: state.user.userData.country || '', // Default to empty string if undefined
        profilePicture: state.user.userData.profilePicture || '', // Default to empty string if undefined
        certifications: state.user.userData.certifications || [] // the list of registered/paid certifications
      }
      // Before storing, make sure to serialize the data and stringify
      const serializedUserData = JSON.parse(JSON.stringify(serializedUser))

      localforage.setItem('user', serializedUserData).catch((error) => console.error(error))
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
