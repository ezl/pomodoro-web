<template>
  <div id='groups'>
    <a @click="showEntryDialog">Start or Join a Pomodoro Party</a>
    <br>
    <button @click="show('hello-world')">
      show
    </button>
    <button @click="hide('hello-world')">
      hide
    </button>

    <modal name="hello-world">
      hello, world!
    </modal>

    <v-dialog />

    <GroupSessionForm />
    <hr>
    <UserSettingsForm />
  </div>
</template>

<script>
import GroupSessionForm from '~/components/GroupSessionForm.vue'
import UserSettingsForm from '~/components/UserSettingsForm.vue'

export default {
  components: {
    GroupSessionForm,
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
              alert('Join')
            }
          }, // End join block
          {
            title: 'Start',
            handler: () => {
              alert('Start')
            }
          }, // End start block
          {
            title: '<span class="muted">Cancel</span>'
          }
        ]
      })
    } // showEntryModal
  }
}
</script>
<style>
#groups {
  padding-top: 50px;
  text-align: center;
}
</style>
