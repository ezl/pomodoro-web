<template>
  <section class="socketStatusIndicator" @click="toggleWebSocketConnection">
    <span
      id="socketStatusIndicator"
      class="dot"
      :class="{
        green: $store.getters['sockets/isConnected'],
        red: $store.getters['sockets/isDisconnected'],
        yellow: $store.getters['sockets/isPending']
      }"
    />
  </section>
</template>
<script>
export default {
  methods: {
    toggleWebSocketConnection: function() {
      if (this.$store.getters['sockets/isConnected']) {
        this.$socketManager.closeWebSocket()
      } else {
        this.$socketManager.openWebSocket()
      }
    }
  }
}
</script>
<style>
section.socketStatusIndicator {
  cursor: pointer;
  height: 20px;
  width: 30px; /* matching dimensions of hamburger box */
}
</style>
