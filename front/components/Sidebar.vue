<template>
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

    <Preferences />
    <hr>
    <GroupSessionForm />

    <div class="side-menu-ad" style="display:none;">
      <img src="https://via.placeholder.com/90x130">
      <div class="side-menu-ad-text">
        <p>Lorem ipsum dolor sit amet consectetur</p>
        <a href="#">link</a>
      </div>
    </div>
  </nav>
</template>

<script>
import Preferences from '~/components/Preferences.vue'
import GroupSessionForm from '~/components/GroupSessionForm.vue'
export default {
  components: { Preferences, GroupSessionForm },
  data: function() {
    return {}
  }
}
</script>
