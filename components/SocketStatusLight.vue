<template>
  <section id="socketStatusLight">
    <span>Connection Status:</span>
    <span id="socketStatusIndicator" class="dot" :class="socketStatus()" />
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      socketStatus: function() {
        if (this.$socketManager.getIsConnected() === true) {
          return 'dot green'
        } else if (this.$socketManager.getIsDisconnected() === true) {
          return 'dot red'
        } else if (this.$socketManager.getIsPending() === true) {
          return 'dot yellow'
        } else {
          return 'dot'
        }
      }
    }
  }
}
</script>
