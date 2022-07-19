<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.find((thread) => thread.id === this.id)
    },
    text () {
      const post = this.$store.state.posts.find(
        (post) => post.id === this.thread.posts[0]
      )
      return post.text || ''
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchPost', 'updateThread']),
    async save ({ title, text }) {
      // dispactch a vuex action
      const thread = await this.updateThread({
        id: this.id,
        title: title,
        text: text
      })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    this.fetchPost({ id: thread.posts[0] })
  }
}
</script>

<style></style>
