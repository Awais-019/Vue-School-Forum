<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsFromCatergory(category)"
    :categoryName="category.name"
  />
</template>

<script>
import ForumList from '@/components/ForumList.vue'
import sourceDate from '@/data.json'
export default {
  components: {
    ForumList
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  methods: {
    getForumsFromCatergory (category) {
      return sourceDate.forums.filter(
        (forum) => forum.categoryId === category.id
      )
    }
  }
}
</script>

<style></style>
