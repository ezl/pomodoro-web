<template>
  <div>
    <nav id="side-menu" class="side-menu slideout-menu">
      <div class="side-menu-header">
        <h1 class="main-header">
          <a data-scroll href="#intro">
            Pomodoro Timer
          </a>
        </h1>

        <h2 class="sub-header">
          Share a pomodoro session with an coworker or friend!
        </h2>
      </div>

      <h3>Settings</h3>
      <Preferences />
      <span>^ preferences table should be above here</span>

      <h3>Messages</h3>
      <ul>
        <li class="uppercase">
          <a href="">Foo</a>
        </li>
        <li class="uppercase">
          <a href="">Bar</a>
        </li>
        <li class="uppercase">
          <a href="">Baz</a>
        </li>
        <li class="uppercase">
          <a href="">Qux</a>
        </li>
      </ul>
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
          <p>Foo bar baz</p>
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
