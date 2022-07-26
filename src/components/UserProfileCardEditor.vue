<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImage
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
            <fa-icon
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opcaity: '8' }"
            ></fa-icon>
          </div>
          <input
            v-show="false"
            type="file"
            id="avatar"
            accept="image/*"
            @change="handleAvatarUpload"
          />
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event" />

      <div class="form-group">
        <input
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="activeUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          v-model="activeUser.website"
          autocomplete="off"
          class="form-input"
          id="user_website"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          v-model="activeUser.email"
          autocomplete="off"
          class="form-input"
          id="user_email"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          v-model="activeUser.location"
          autocomplete="off"
          class="form-input"
          id="user_location"
          list="locations"
          @mouseenter="loadLocationOptions"
        />
      </div>
      <datalist id="locations">
        <option
          v-for="location in locationOptions"
          :value="location.name.common"
          :key="location.name.common"
        />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
    <UserProfileCardEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner.vue'
import AppAvatarImage from '@/components/AppAvatarImage.vue'
import UserProfileCardEditorRandomAvatar from '@/components/UserProfileCardEditorRandomAvatar.vue'
import UserProfileCardEditorReauthenticate from '@/components/UserProfileCardEditorReauthenticate.vue'
import useNotifications from '@/Composables/useNotifications'
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    AppSpinner,
    AppAvatarImage,
    UserProfileCardEditorRandomAvatar,
    UserProfileCardEditorReauthenticate
  },
  setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: [],
      needsReAuth: false
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions () {
      if (this.locationOptions.length > 0) return
      const res = await fetch('https://restcountries.com/v3.1/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith(
        'https://pixabay.com/'
      )
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()
        this.activeUser.avatar = await this.uploadAvatar({
          file: blob,
          filename: 'random'
        })
      }
    },
    async onReauthenticated () {
      await this.$store.dispatch('auth/updateEmail', {
        email: this.activeUser.email
      })
      this.saveUserData()
    },
    async onReauthenticatedFailed () {
      this.addNotification({
        message: 'Error updating user',
        type: 'error',
        timeout: 3000
      })
      this.$router.push({ name: 'Profile' })
    },
    async saveUserData () {
      await this.handleRandomAvatarUpload()
      await this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
      this.addNotification({
        message: 'User successfully updated',
        timeout: 3000
      })
    },
    async save () {
      const emailChanged = this.activeUser.email !== this.user.email
      if (emailChanged) {
        this.needsReAuth = true
      } else {
        this.saveUserData()
      }
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>

<style></style>
