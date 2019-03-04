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
      </div>

      <div class="content">
        <div class="row">
          <!-- main content area -->
          <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
export default {
  components: { Sidebar }
}
</script>
