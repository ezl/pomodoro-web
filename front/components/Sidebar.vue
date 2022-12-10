<template>
  <nav id="side-menu" class="side-menu slideout-menu">
    <div class="side-menu-header">
      <h1 class="main-header">
        Pomodoro Party
      </h1>

      <h2 class="sub-header">
        Share a pomodoro session with a coworker or friend
      </h2>
    </div>

    <Preferences />

    <div class="side-menu-ad row">
      <div class="twelve columns">
        <img src="@/assets/images/eric-hey.png" />
        <div class="side-menu-ad-text">
          <p>
            Hi, I'm Eric!
            <br /><br />
            <a
              href="mailto:pomodoro@fattyfatfat.com
            ?subject=Pomodoro%20Party
            &amp;body=Hi!"
              >Email me</a
            >
            with any feedback, notes, bugs, or requests!
          </p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Preferences from '~/components/Preferences.vue'
export default {
  components: {
    Preferences
  },
  data: function() {
    return {}
  }
}
</script>
