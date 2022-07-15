<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="newPostText"
          name=""
          id=""
          class="form-input"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const postId = 'aaaa' + Math.random()
      const post = {
        id: postId,
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
      }
      this.newPostText = ''
      this.$emit('save', { post })
    }
  }
}
</script>

<style></style>
