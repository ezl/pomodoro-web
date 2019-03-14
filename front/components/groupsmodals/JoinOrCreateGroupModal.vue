<template>
  <div>
    <CreateGroupSuccessModal />
    <JoinGroupGetSessionNameModal />
    <modal name="joinOrCreateGroupModal" height="auto" :scrollable="true">
      <div class="modal">
        <div class="modal-header">
          <h3>Start or Join A Group Pomodoro</h3>
        </div>
        <div class="modal-body">
          <p>Trying to get work done with a friend or colleague? Help each other stay on track by syncing your work &amp; break times.</p>
          <p>Do you want to start a new session or join an existing one?</p>

          <div class="row">
            <button class="one-half column" @click="start">
              Start
            </button>
            <button class="one-half column" @click="join">
              Join
            </button>
          </div><!-- row -->
          <div class="row">
            <div class="muted center italic underline" @click="cancel">
              Cancel
            </div>
          </div><!-- row -->
        </div>
      </div><!-- .modal -->
    </modal>
  </div>
</template>

<script>
import CreateGroupSuccessModal from '~/components/groupsmodals/CreateGroupSuccessModal.vue'
import JoinGroupGetSessionNameModal from '~/components/groupsmodals/JoinGroupGetSessionNameModal.vue'
export default {
  name: 'JoinOrCreateGroupModal',
  components: {
    CreateGroupSuccessModal,
    JoinGroupGetSessionNameModal
  },
  methods: {
    show(modalName) {
      this.$modal.show(modalName)
    },
    hide(modalName) {
      this.$modal.hide(modalName)
    },
    join() {
      this.hide('joinOrCreateGroupModal')
      this.show('joinGroupGetSessionName')
    },
    start() {
      this.hide('joinOrCreateGroupModal')
      this.show('createGroupSuccess')
    },
    cancel() {
      this.hide('joinOrCreateGroupModal')
    }
  }
}
</script>
