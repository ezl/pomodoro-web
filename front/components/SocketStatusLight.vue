<template>
  <section class="socketStatusIndicator">
    <span>Connection:</span>
    <span
      id="socketStatusIndicator"
      class="dot"
      :class="{ 'green': $store.getters['sockets/isConnected'],
                'red': $store.getters['sockets/isDisconnected'],
                'yellow': $store.getters['sockets/isPending']}"
    />
  </section>
</template>
