<template>
  <div v-if="threads" class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
              >{{ thread.title }}</router-link
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }} replies</p>

          <AppAvatarImage
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatarImage from '@/components/AppAvatarImage.vue'
export default {
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  components: { AppAvatarImage },
  computed: {
    posts () {
      return this.$store.state.posts.items
    },
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find((p) => p.id === postId)
    },
    userById (userId) {
      return this.users.find((u) => u.id === userId) || {}
    }
  }
}
</script>

<style></style>
