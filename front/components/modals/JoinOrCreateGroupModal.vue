<template>
  <div>
    <modal
      name="joinOrCreateGroupModal"
      height="auto"
      :scrollable="true"
      :adaptive="true"
    >
      <div class="modal">
        <div class="modal-header">
          <h3>Start or Join A Group Pomodoro</h3>
          <i class="fa fa-times close-modal" @click="cancel"></i>
        </div>
        <div class="modal-body">
          <p>
            Trying to get work done with a friend or colleague? Help each other
            stay on track by syncing your work &amp; break times.
          </p>
          <p>Do you want to start a new session or join an existing one?</p>

          <div class="row">
            <button class="one-half column" @click="join">
              Join
            </button>
            <button class="one-half column" @click="start">
              Start
            </button>
          </div>
          <!-- row -->
          <div class="row center">
            <span class="cancel muted underline" @click="cancel">
              Cancel
            </span>
          </div>
          <!-- row -->
        </div>
      </div>
      <!-- .modal -->
    </modal>
  </div>
</template>

<script>
export default {
  name: 'JoinOrCreateGroupModal',
  methods: {
    show(modalName) {
      this.$modal.show(modalName)
    },
    hide(modalName) {
      this.$modal.hide(modalName)
    },
    join() {
      this.$store.commit('setJoinOrCreateModalMode', 'join')
      this.hide('joinOrCreateGroupModal')
      this.show('getSessionNameModal')
    },
    start() {
      this.$store.commit('setJoinOrCreateModalMode', 'create')
      this.hide('joinOrCreateGroupModal')
      this.show('getSessionNameModal')
    },
    cancel() {
      this.hide('joinOrCreateGroupModal')
    }
  }
}
</script>
<style>
.modal span.cancel {
  cursor: pointer;
}
</style>
