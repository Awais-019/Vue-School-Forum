<template>
  <div class="col-full">
    <h1>Not Found</h1>
    <router-link :to="{ name: 'Home' }">Read some cool threads</router-link>
  </div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>

<style></style>
