<template>
  <div>
    <Modals />
    <Sidebar />

    <div id="content-wrapper" :class="{ 'is-active': showMenu }" class="content-wrapper slideout-panel">
      <div id="top-bar" class="top-bar">
        <button :class="{ 'is-active': showMenu }" class="side-menu-toggle hamburger hamburger--spin" type="button" @click="showMenu = !showMenu">
          <span class="hamburger-box">
            <span class="hamburger-inner" />
          </span>
        </button>
        <div>
          <h1 id="top-bar-header">
            Pomodoro Party
          </h1>
        </div>
        <SocketStatusLight />
      </div>

      <!-- main content area -->
      <nuxt />
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Modals from '~/components/Modals.vue'
import SocketStatusLight from '~/components/SocketStatusLight.vue'

export default {
  components: {
    Modals,
    Sidebar,
    SocketStatusLight
  },
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
