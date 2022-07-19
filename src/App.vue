<template>
  <TheNavBar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar.vue'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavBar },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style>
@import "@/assets/style.css";
</style>
