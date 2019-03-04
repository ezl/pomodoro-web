<template>
  <section id="socketStatusLight">
    <span>Connection Status:</span>
    <span id="socketStatusIndicator" class="dot" :class="socketStatusClass" />
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      socketStatusClass: 'dot',
      socketManager: this.$socketManager
    }
  },
  watch: {
    socketManager: {
      handler: function(socket) {
        if (socket.getIsConnected() === true) {
          this.socketStatusClass = 'dot green'
        } else if (socket.getIsDisconnected() === true) {
          this.socketStatusClass = 'dot red'
        } else if (socket.getIsPending() === true) {
          this.socketStatusClass = 'dot yellow'
        } else {
          this.socketStatusClass = 'dot'
        }
      },
      deep: true
    }
  }
}
</script>
