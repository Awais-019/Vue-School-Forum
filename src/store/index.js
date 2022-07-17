import { createStore } from 'vuex'
import sourceData from '@/data.json'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  actions: {
    createPost (context, post) {
      post.id = 'aaaa' + Math.random()
      context.commit('setPost', { post }) // set the post
      context.commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId
      }) // append the post to the thread
    }
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find((user) => user.id === state.authId)
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
  mutations: {
    setPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId)
      thread.posts.push(postId)
    }
  }
})
