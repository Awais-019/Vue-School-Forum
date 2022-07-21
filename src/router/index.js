import HomeView from '@/pages/HomeView.vue'
import ThreadShow from '@/pages/ThreadShow.vue'
import ThreadCreate from '@/pages/ThreadCreate.vue'
import ThreadEdit from '@/pages/ThreadEdit.vue'
import NotFound from '@/pages/NotFound.vue'
import ForumView from '@/pages/ForumView.vue'
import Category from '@/pages/CategoryView.vue'
import Profile from '@/pages/ProfileView.vue'
import RegisterForm from '@/pages/RegisterForm.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: {
      toTop: true,
      smoothScroll: true
    }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: ForumView,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true
    // beforeEnter (to, from, next) {
    //   // check if thread exists
    //   const threads = sourceData.threads.find(
    //     (thread) => thread.id === to.params.id
    //   )
    //   // if exsits, go to thread
    //   if (threads) {
    //     return next()
    //   } else {
    //     // if not, redirect to 404
    //     next({
    //       name: 'NotFound',
    //       params: { pathMatch: to.path.substring(1).split('/') },
    //       // preserve query and hash
    //       query: to.query,
    //       hash: to.hash
    //     })
    //   }
    // }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnapshots')
})

export default router
