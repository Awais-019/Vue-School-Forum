<template>
  <TheNavBar />
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar.vue'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavBar },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
    this.$router.beforeEach(() => {
      this.showPage = false
    })
  }
}
</script>

<style>
@import "@/assets/style.css";
</style>
