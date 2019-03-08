<template>
  <section class="socketStatusIndicator">
    <span>Connection:</span>
    <span id="socketStatusIndicator" class="dot" :class="socketStatusClass" />
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      socketStatusClass: 'dot'
    }
  },
  watch: {
    socketManager: {
      handler: function(socket) {
        if (this.$store.getters['sockets/isConnected'] === true) {
          this.socketStatusClass = 'dot green'
        } else if (this.$store.getters['sockets/isDisconnected'] === true) {
          this.socketStatusClass = 'dot red'
        } else if (this.$store.getters['sockets/isPending'] === true) {
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
