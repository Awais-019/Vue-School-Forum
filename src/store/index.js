import { createStore } from 'vuex'
import sourceData from '@/data.json'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser: (state) => {
      const user = findById(state.users, state.authId)
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
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'aaaa' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post }) // set the post
      commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId
      }) // append the post to the thread
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'aaaa' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', { thread })
      commit('appendThreadToForum', { forumId, threadId: id })
      commit('appendThreadToUser', { userId, threadId: id })
      dispatch('createPost', { text, threadId: id })
      return findById(state.threads, id) // return the thread
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0].id)
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    }
  },

  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },
    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId)
      state.users[userIndex] = user
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = findById(state.threads, threadId)
      thread.posts = thread.posts || []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { threadId, forumId }) {
      const forum = findById(state.forums, forumId)
      forum.threads = forum.threads || []
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { threadId, userId }) {
      const user = findById(state.users, userId)
      user.threads = user.threads || []
      user.threads.push(threadId)
    }
  }
})
