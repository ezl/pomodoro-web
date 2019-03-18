<template>
  <div>
    <modal name="userDisconnectedModal" height="auto" :scrollable="true" :adaptive="true" :clickToClose="false">
      <div class="modal">
        <div class="modal-header">
          <h3>Disconnected</h3>
        </div>
        <div class="modal-body">
          <p>Hmmm... you seem to have gotten disconnected from an online session</p>
          <p>Would you like to reconnect or just work offline for now?</p>

          <div class="row">
            <button class="one-half column" @click="reconnect">
              Reconnect
            </button>
            <button class="one-half column" @click="$modal.hide('userDisconnectedModal')">
              Work Offline
            </button>
          </div><!-- row -->
        </div>
      </div><!-- .modal -->
    </modal>
  </div>
</template>

<script>
export default {
  name: 'UserDisconnectedModal',
  methods: {
    reconnect: function() {
      this.$socketManager.openWebSocket()
      this.$modal.hide('userDisconnectedModal')
    }
  }
}
</script>
