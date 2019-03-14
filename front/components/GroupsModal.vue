<template>
  <div id="groups">
    <a @click="showJoinOrCreateGroupModal">Start or Join a Pomodoro Party</a>
    <JoinOrCreateGroupModal />
    <UserSettingsForm /><!-- this will get moved -->
  </div>
</template>

<script>
import JoinOrCreateGroupModal from '~/components/groupsmodals/JoinOrCreateGroupModal.vue'
import UserSettingsForm from '~/components/UserSettingsForm.vue'

export default {
  components: {
    JoinOrCreateGroupModal,
    UserSettingsForm
  },
  methods: {
    showJoinOrCreateGroupModal() {
      this.$modal.show('joinOrCreateGroupModal')
    }
  }
}
</script>
<style>
#groups {
  padding-top: 50px;
  text-align: center;
}
</style>
