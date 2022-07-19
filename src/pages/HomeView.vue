<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created () {
    const catergories = await this.fetchAllCategories()
    const forumIds = catergories.map((catergory) => catergory.forums).flat()
    this.fetchForums({ ids: forumIds })
    console.log('before create', this.$store.state.categories)
  }
}
</script>

<style></style>
