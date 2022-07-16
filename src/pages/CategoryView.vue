<template>
  <h1 class="text-center">{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsFromCategory(category)" />
</template>

<script>
import ForumList from '@/components/ForumList.vue'
export default {
  components: {
    ForumList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.find(
        (category) => category.id === this.id
      )
    }
  },
  methods: {
    getForumsFromCategory (category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id
      )
    }
  }
}
</script>

<style></style>
