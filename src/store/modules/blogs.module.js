import { db } from '@/firebase/firebaseInit'
import { collection, getDocs, limit, query, where, doc, setDoc, orderBy } from 'firebase/firestore'

import { getField, updateField } from 'vuex-map-fields'
import localforage from 'localforage'

const state = {
  blogs: [],
  singleBlog: {}
}

const actions = {
  async addBlog({ commit }, blog) {
    try {
      await setDoc(doc(db, 'blogs', blog.slug), blog)
      commit('updateField', {
        path: 'singleBlog',
        value: blog
      })
    } catch (error) {
      console.error('Error adding Blog:', error)
    }
  },

  async getBlogs({ commit }, { pageSize = 10, lastDoc = null }) {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('isPublished', '==', true),
        // orderBy('publishedAt', 'desc'),
        limit(pageSize)
        // lastDoc ? startAfter(lastDoc) : null
      )

      const querySnapshot = await getDocs(q)
      const blogs = []

      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() })
      })
      commit('updateField', {
        path: 'blogs',
        value: blogs
      })
    } catch (error) {
      console.error('Error fetching and setting blogs:', error)
    }
  },

  async getMyBlogs({ commit }, { pageSize = 10, lastDoc = null, uid }) {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('ownerId', '==', uid),
        orderBy('updatedAt', 'desc'),
        limit(pageSize)
        // lastDoc ? startAfter(lastDoc) : null
      )
      const querySnapshot = await getDocs(q)
      const blogs = []
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() })
      })

      commit('updateField', {
        path: 'blogs',
        value: blogs
      })
    } catch (error) {
      console.error('Error fetching and setting blogs:', error)
    }
  },

  async getSingleBlog({ commit }, slug) {
    try {
      const q = query(collection(db, 'blogs'), where('slug', '==', slug))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const blogData = querySnapshot.docs[0] // Get the first document
        // To update store you always need the updateField helper function (vuex-map-fields)
        // Commit the single blog data
        console.log('blogData', blogData.id , blogData.data())
        const singleBlogValue = { id: blogData.id, ...blogData.data() }; 
        console.log('singleBlogValue',singleBlogValue)

        commit('updateField', {
          path: 'singleBlog',
          value: singleBlogValue
        })
        // commit('setSingleBlog', { id: blogData.id, ...blogData.data() }) // Commit the single blog data
      } else {
        console.log('No such document with this slug!')
      }
    } catch (error) {
      console.error('Error fetching single blog by slug:', error)
    }
  }
}

const mutations = {
  updateField,
  setBlogs(state, blogs) {
    state.blogs = blogs
  },
  setSingleBlog(state, blog) {
    state.singleBlog = blog
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
