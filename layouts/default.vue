<template>
  <div>
    <nav id="side-menu" class="side-menu slideout-menu">
      <div class="side-menu-header">
        <h1 class="main-header">
          <a>
            Pomodoro
          </a>
        </h1>

        <h2 class="sub-header">
          Share a session with an coworker or friend!
        </h2>
      </div>

      <h3>Settings</h3>
      <Preferences />

      <div class="side-menu-ad" style="display:none;">
        <img src="https://via.placeholder.com/90x130"></img>
        <div class="side-menu-ad-text">
          <p>Lorem ipsum dolor sit amet consectetur</p>
          <a href="#">link</a>
        </div>
      </div>
    </nav>

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
import Preferences from '~/components/Preferences.vue'
export default {
  components: { Preferences }
}
</script>
