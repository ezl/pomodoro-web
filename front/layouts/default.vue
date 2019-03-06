<template>
  <div>
    <Sidebar />

    <div id="content-wrapper" class="content-wrapper slideout-panel">
      <div id="top-bar" class="top-bar">
        <button class="side-menu-toggle hamburger hamburger--spin" type="button">
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
  components: { Sidebar, SocketStatusLight }
}
</script>
