import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import useNotifications from '@/Composables/useNotifications'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication ({ state, dispatch, commit }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          console.log('👣 the user has changed')
          dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailAndPassword (
      { dispatch },
      { email, name, username, avatar = null, password }
    ) {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      avatar = await dispatch('uploadAvatar', {
        userId: result.user.uid,
        file: avatar
      })
      await dispatch(
        'users/createUser',
        {
          id: result.user.uid,
          email,
          name,
          username,
          avatar
        },
        { root: true }
      )
    },
    async uploadAvatar ({ state }, { authId, file, filename }) {
      if (!file) return null
      authId = authId || state.authId
      filename = filename || file.name
      try {
        const storageBucket = firebase
          .storage()
          .ref()
          .child(`uploads/${authId}/images/${Date.now()}-${filename}`)
        const snapshot = await storageBucket.put(file)
        const url = await snapshot.ref.getDownloadURL()
        console.log('📷 uploaded avatar', url)
        return url
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Error uploading avatar image',
          type: 'Error'
        })
      }
    },
    async signInWithEmailAndPassword (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      const userDoc = await userRef.get()
      if (!userDoc.exists) {
        return dispatch(
          'users/createUser',
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL
          },
          { root: true }
        )
      }
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAuthId', null)
    },
    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = firebase.auth().currentUser?.uid
      console.log('In fetchauth', userId)
      if (!userId) return
      await dispatch(
        'fetchItem',
        {
          emoji: '🙋',
          resource: 'users',
          id: userId,
          handleUnsubscribe: (unsubscribe) => {
            commit('setAuthUserUnsubscribe', unsubscribe)
          }
        },
        { root: true }
      )
      commit('setAuthId', userId)
      console.log('Auth id set', state.authId)
    },
    async fetchAuthUserPosts ({ commit, state }, { startAfter }) {
      // limit(10) number of records to get
      // startAfter(doc) indicates at what point the page should begin
      // orderBy() indicates the order of the records
      let query = await firebase
        .firestore()
        .collection('posts')
        .where('userId', '==', state.authId)
        .orderBy('publishedAt', 'desc')
        .limit(10)
      if (startAfter) {
        const doc = await firebase
          .firestore()
          .collection('posts')
          .doc(startAfter.id)
          .get()
        query = query.startAfter(doc)
      }
      const posts = await query.get()
      posts.forEach((item) => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
