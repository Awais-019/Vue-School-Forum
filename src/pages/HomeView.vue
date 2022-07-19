<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  beforeCreate () {
    this.$store.dispatch('fetchAllCatergories')
    console.log('before create', this.$store.state.categories)
  },
  created () {
    console.log('created', this.categories)
  },
  befreMount () {
    console.log('before mount', this.categories)
  },
  mounted () {
    console.log('mounted', this.categories, this.$el)
  }
}
</script>

<style></style>
