import { db } from '@/firebase/firebaseInit'
import {
    collection,
    getDocs,
    limit,
    query,
    where
} from 'firebase/firestore'
import { getField, updateField } from 'vuex-map-fields'

const state = {
  blogs: [],
  singleBlog: {}
}

const actions = {
  async getBlogs({ commit }, { pageSize = 10, lastDoc = null }) {
    console.log('here')
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

      commit('setBlogs', blogs)
    } catch (error) {
      console.error('Error fetching and setting blogs:', error)
    }
  },

  async getSingleBlog({ commit }, slug) {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('slug', '==', slug) 
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const blogData = querySnapshot.docs[0] // Get the first document
        commit('setSingleBlog', { id: blogData.id, ...blogData.data() }) // Commit the single blog data
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
