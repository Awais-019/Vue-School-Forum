import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    posts: []
  },
  getter: {},
  actions: {
    async createPost ({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      const batch = firebase.firestore().batch()
      const postRef = firebase.firestore().collection('posts').doc()
      const userRef = firebase
        .firestore()
        .collection('users')
        .doc(rootState.auth.authId)
      const threadRef = firebase
        .firestore()
        .collection('threads')
        .doc(post.threadId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(
          rootState.auth.authId
        )
      })
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })
      await batch.commit()
      const newPost = await postRef.get()
      commit(
        'setItem',
        {
          resource: 'posts',
          item: { ...newPost.data(), id: newPost.id }
        },
        { root: true }
      ) // set the post
      commit(
        'threads/appendPostToThread',
        {
          childId: newPost.id,
          parentId: post.threadId
        },
        { root: true }
      ) // append the post to the thread
      commit(
        'threads/appendContributorToThread',
        {
          parentId: post.threadId,
          childId: rootState.auth.authId
        },
        { root: true }
      ) // append contributor to the thread
    },
    async updatePost ({ commit, state, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          moderator: false
        }
      }
      const postRef = firebase.firestore().collection('posts').doc(id)
      await postRef.update(post)
      const updatedPost = await postRef.get()
      commit(
        'setItem',
        { resource: 'posts', item: updatedPost },
        { root: true }
      )
    },
    fetchPost: ({ dispatch }, { id }) =>
      dispatch(
        'fetchItem',
        { emoji: '💬', resource: 'posts', id },
        { root: true }
      ),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch(
        'fetchItems',
        { resource: 'posts', ids, emoji: '💬' },
        { root: true }
      )
  },
  mutations: {}
}
