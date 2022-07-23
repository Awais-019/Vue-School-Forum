import {
  findById,
  docToResource,
  makeAppendChildToParentMutation
} from '@/helpers'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  state: {
    items: []
  },
  getters: {
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
            return user.postsCount || 0
          },
          // authUser.threads
          get threads () {
            return state.threads.filter((thread) => thread.userId === user.id)
          },
          // authUser.threadsCount
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    async createUser ({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {
        id,
        avatar,
        email,
        name,
        username,
        usernameLower,
        registeredAt
      }
      const userRef = await firebase.firestore().collection('users').doc(id)
      userRef.set(user)
      const newUser = await userRef.get()
      commit('setItem', {
        resource: 'users',
        item: newUser
      })
      return docToResource(newUser)
    },
    async updateUser ({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      const userRef = firebase.firestore().collection('users').doc(user.id)
      await userRef.update(updates)
      commit('setItem', { resources: 'users', item: user })
    },
    fetchUser: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { emoji: '🙋', resource: 'users', id }),
    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    })
  }
}
