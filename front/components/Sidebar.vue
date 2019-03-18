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
        <img src="@/assets/images/eric-hey.png">
        <div class="side-menu-ad-text">
          <p>
            Feedback, notes, bug reports appreciated!<br><br>
            <a href="https://docs.google.com/document/d/1dPUTG1fjuSnQXPLk_YwF67VmJ2WV-vIGPutU6msCp8o/edit">Google Doc</a>
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
