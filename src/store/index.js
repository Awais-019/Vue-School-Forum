import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          // authUser.posts
          get posts () {
            return state.posts.filter((post) => post.userId === user.id)
          },
          // authUser.postsCount
          get postsCount () {
            return this.posts.length
          },
          // authUser.threads
          get threads () {
            return state.threads.filter((thread) => thread.userId === user.id)
          },
          // authUser.threadsCount
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'aaaa' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setItem', { resource: 'posts', item: post }) // set the post
      commit('appendPostToThread', {
        childId: post.id,
        parentId: post.threadId
      }) // append the post to the thread
      commit('appendContributorToThread', {
        parentId: post.threadId,
        childId: state.authUser
      }) // append contributor to the thread
    },
    updateUser ({ commit }, user) {
      commit('setItem', { resources: 'users', item: user })
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'aaaa' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setItem', { resource: 'threads', item: thread })
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      commit('appendThreadToUser', { parentId: userId, childId: id })
      dispatch('createPost', { text, threadId: id })
      return findById(state.threads, id) // return the thread
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0].id)
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setItem', { resource: 'threads', item: newThread })
      commit('setItem', { resource: 'posts', item: newPost })
      return newThread
    },
    // ---------------------------------------
    // Fetch Single Resource
    // ---------------------------------------
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { emoji: '🏷', resource: 'categories', id })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { emoji: '🏁', resource: 'forums', id })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { emoji: '📄', resource: 'threads', id })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { emoji: '💬', resource: 'posts', id })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { emoji: '🙋', resource: 'users', id })
    },
    // ---------------------------------------
    // Fetch All of a Resource
    // ---------------------------------------
    fetchAllCategories ({ commit }) {
      console.log('🔥', '🏷', 'all')
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection('categories')
          .onSnapshot((querySnapshot) => {
            const categories = querySnapshot.docs.map((doc) => {
              const item = { id: doc.id, ...doc.data() }
              commit('setItem', { resource: 'categories', item })
              return item
            })
            resolve(categories)
          })
      })
    },
    // ---------------------------------------
    // Fetch Multiple Resources
    // ---------------------------------------
    fetchCategories ({ dispatch }, { ids }) {
      return dispatch('fetchItems', {
        resource: 'categories',
        ids,
        emoji: '🏷'
      })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
    },
    fetchItem ({ state, commit }, { id, emoji, resource }) {
      console.log('🔥', emoji, id)
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection(resource)
          .doc(id)
          .onSnapshot((doc) => {
            const item = { ...doc.data(), id: doc.id }
            commit('setItem', { resource, item })
            resolve(item)
          })
      })
    },
    fetchItems ({ dispatch }, { ids, resource, emoji }) {
      return Promise.all(
        ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
      )
    }
  },

  mutations: {
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'thread'
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
