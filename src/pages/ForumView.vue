<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link
          :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
          class="btn-green btn-small"
          >Start a thread</router-link
        >
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="threads" />
      <v-pagination v-model="page" :pages="totalPages" active-color="#57AD8D" />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: {
    ThreadList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      page: Number(this.$route.query.page) || 1,
      perPage: 10
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    forum () {
      return this.$store.state.forums.items.find(
        (forum) => forum.id === this.id
      )
    },
    threads () {
      if (!this.forum) return []
      return this.$store.state.threads.items
        .filter((thread) => thread.forumId === this.forum.id)
        .map((thread) => this.$store.getters['threads/thread'](thread.id))
    },
    threadsCount () {
      return this.forum.threads?.length || 0
    },
    totalPages () {
      if (!this.threadsCount) return 0
      return Math.ceil(this.threadsCount / this.perPage)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreadsByPage({
      ids: forum.threads,
      page: this.page,
      perPage: this.perPage
    })
    await this.fetchUsers({ ids: threads.map((t) => t.userId) })
    this.asyncDataStatus_fetched()
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page: this.page } })
    }
  }
}
</script>

<style></style>
