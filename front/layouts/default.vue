<template>
  <div>
    <Sidebar />

    <div id="content-wrapper" :class="{ 'is-active': showMenu }" class="content-wrapper slideout-panel">
      <div id="top-bar" class="top-bar">
        <button :class="{ 'is-active': showMenu }" v-on:click="showMenu = !showMenu" class="side-menu-toggle hamburger hamburger--spin" type="button">
          <span class="hamburger-box">
            <span class="hamburger-inner" />
          </span>
        </button>
        <SocketStatusLight />
      </div>

      <!-- main content area -->
      <nuxt />
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import SocketStatusLight from '~/components/SocketStatusLight.vue'

export default {
  components: { Sidebar, SocketStatusLight },
  data: function() {
    return {
      showMenu: false
    }
  }
}
</script>
<style>
div#content-wrapper {
  transition-duration: 0.3s;
}
div#content-wrapper.is-active {
  transform: translateX(256px);
}
</style>
