<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <a href="#">{{ categoryName }}</a>
      </h2>
      <!-- <h2 class="list-title">
        <a href="#">Forums</a>
      </h2> -->

      <div class="forum-listing" v-for="forum in forums" :key="forum.id">
        <div class="forum-details">
          <router-link
            class="text-xlarge"
            :to="{ name: 'Forum', params: { id: forum.id } }"
            >{{ forum.name }}</router-link
          >
          <p>{{ forum.description }}</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length }}</span>
            {{ forumThreadWord(forum) }}
          </p>
        </div>

        <div class="last-thread"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    forums: {
      type: Array,
      required: true
    },
    categoryName: {
      type: String,
      default: 'Forums'
    }
  },
  methods: {
    forumThreadWord (forum) {
      return forum.threads?.length
        ? forum.threads?.length === 1
          ? 'thread'
          : 'threads'
        : 'no threads'
    }
  }
}
</script>

<style></style>
