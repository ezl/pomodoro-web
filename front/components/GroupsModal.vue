<template>
  <div id="groups">
    <a @click="showEntryDialog">Start or Join a Pomodoro Party</a>

    <v-dialog />
    <CreateGroupSuccessModal />
    <JoinGroupGetSessionNameModal />

    <UserSettingsForm /><!-- this will get moved -->
  </div>
</template>

<script>
import CreateGroupSuccessModal from '~/components/groupsmodals/CreateGroupSuccessModal.vue'
import JoinGroupGetSessionNameModal from '~/components/groupsmodals/JoinGroupGetSessionNameModal.vue'
import UserSettingsForm from '~/components/UserSettingsForm.vue'

export default {
  components: {
    CreateGroupSuccessModal,
    JoinGroupGetSessionNameModal,
    UserSettingsForm
  },
  methods: {
    show(modalName) {
      this.$modal.show(modalName)
    },
    hide(modalName) {
      this.$modal.hide(modalName)
    },
    showEntryDialog() {
      const dialogContent =
        '<p>Trying to get work done with a friend or colleague? Help each other stay on track by syncing your work &amp; break times.</p>' +
        '<p>Do you want to start a new session or join an existing one?<p>'
      this.$modal.show('dialog', {
        title: 'Start Or Join A Group Pomodoro',
        text: dialogContent,
        buttons: [
          {
            title: 'Join',
            handler: () => {
              this.$modal.hide('dialog')
              this.show('joinGroupGetSessionName')
            }
          }, // End join block
          {
            title: 'Start',
            handler: () => {
              this.$modal.hide('dialog')
              this.show('createGroupSuccess')
            }
          }, // End start block
          {
            title: '<span class="muted">Cancel</span>'
          }
        ]
      })
    } // showEntryDialog
  }
}
</script>
<style>
#groups {
  padding-top: 50px;
  text-align: center;
}
</style>
