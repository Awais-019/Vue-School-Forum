import { createStore } from 'vuex'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'F5sgVH1lkqPN8OPh4QaOD9qR5yc2',
    unsubscribes: [],
    authUserUnsubscribe: null
  },
  getters,
  actions,
  mutations
})
