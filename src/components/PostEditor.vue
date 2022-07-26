<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <AppFormField
        as="textarea"
        name="text"
        v-model="postCopy.text"
        rows="10"
        cols="30"
        rules="required"
      />
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? "Update post" : "Submit post" }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import AppFormField from '@/components/AppFormField.vue'
export default {
  components: { AppFormField },
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data () {
    return {
      postCopy: { ...this.post },
      formKey: Math.random()
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
      this.formKey = Math.random()
    }
  }
}
</script>

<style></style>
