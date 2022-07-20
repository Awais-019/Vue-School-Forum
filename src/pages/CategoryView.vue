<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsFromCategory(category)"
    />
  </div>
</template>

<script>
import ForumList from '@/components/ForumList.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
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
  mixins: [asyncDataStatus],
  computed: {
    category () {
      return (
        this.$store.state.categories.find(
          (category) => category.id === this.id
        ) || {}
      )
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),
    getForumsFromCategory (category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id
      )
    }
  },
  async created () {
    console.log('In category view created')
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style></style>
