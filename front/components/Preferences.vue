<template>
  <div>
    <h3>Settings</h3>
    <section id="preferencesForm">
      <div class="row">
        <div class="six columns">
          <label>Work time</label>
          <input
            v-model="preferencesForm.workDuration"
            class="u-full-width"
            type="number"
            @keyup.enter="savePreferences(true)"
          />
        </div>
        <div class="six columns">
          <label>Rest time</label>
          <input
            v-model="preferencesForm.restDuration"
            class="u-full-width"
            type="number"
            @keyup.enter="savePreferences(true)"
          />
        </div>
      </div>

      <div class="row">
        <label for="playSoundOnChange">
          <input
            id="playSoundOnChange"
            v-model="notificationPreferences.playSound"
            type="checkbox"
            name="playSoundOnChange"
            @change="playSoundOnChangeToggled"
          />
          <span class="label-body">Play sound on state change</span>
        </label>
      </div>

      <div id="notificationsStuff" class="row">
        <label for="allowNotifications">
          <input
            id="allowNotifications"
            v-model="notificationPreferences.displayAlert"
            type="checkbox"
            name="allowNotifications"
            @change="allowNotificationsToggled"
          />
          <span class="label-body">Allow browser notifications</span>
        </label>
      </div>

      <div class="row">
        <div class="six columns">
          <button
            class="u-full-width"
            :disabled="!formIsDirty"
            @click="savePreferences(true)"
          >
            Save
          </button>
        </div>
        <div class="six columns">
          <button
            class="u-full-width"
            :disabled="!formIsDirty"
            @click="cancelChangingPreferences"
          >
            Cancel
          </button>
        </div>
        <button
          class="u-full-width"
          style="display: none;"
          @click="sendPreferences"
        >
          Send Preferences
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data: function() {
    return {
      notificationPreferences: {
        displayAlert: false,
        playSound: false
      },
      preferencesForm: {}
    }
  },
  computed: {
    formIsDirty() {
      const preferencesInMinutes = this.$store.getters.preferencesInMinutes
      const allFieldsUnchanged =
        preferencesInMinutes.autoStartNextSession ===
          this.preferencesForm.autoStartNextSession &&
        preferencesInMinutes.workDuration ===
          this.preferencesForm.workDuration &&
        preferencesInMinutes.restDuration === this.preferencesForm.restDuration
      return !allFieldsUnchanged
    }
  },
  watch: {
    '$store.getters.preferencesInMinutes': {
      handler: function(obj) {
        this.preferencesForm = { ...obj }
      }
    }
  },
  methods: {
    playSoundOnChangeToggled: function() {
      this.$store.commit(
        'setNotificationPreferences',
        this.notificationPreferences
      )
    },
    allowNotificationsToggled: function() {
      this.$store.commit(
        'setNotificationPreferences',
        this.notificationPreferences
      )
      Notification.requestPermission().then(result => {
        console.log(result)
      })
    },
    sendPreferences: function() {
      this.$store.dispatch('sendPreferences', this.$store.state.preferences)
    },
    savePreferences: function(broadcast = false) {
      this.$store.commit('setPreferencesFromMinutes', this.preferencesForm)
      if (this.$store.state.sockets.isConnected) {
        this.sendPreferences()
      }
    },
    cancelChangingPreferences: function() {
      this.preferencesForm = { ...this.$store.getters.preferencesInMinutes }
    }
  }
}
</script>

<style>
.dot {
  margin: 0 8px;
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0px 0px 0px 2px #f4f4f4, 0px 0px 0px 4px #bbb;
}
.dot.green {
  background-color: #5cb85c;
  box-shadow: 0px 0px 0px 2px #f4f4f4, 0px 0px 2px 4px #5cb85c;
}
.dot.yellow {
  background-color: #f0ad4e;
  box-shadow: 0px 0px 0px 2px #f4f4f4, 0px 0px 2px 4px #f0ad4e;
}
.dot.red {
  background-color: #ff0000;
  box-shadow: 0px 0px 0px 2px #f4f4f4, 0px 0px 2px 4px #ff0000;
}
label {
  color: #aaa;
  font-weight: normal;
  font-size: 0.8em;
}
</style>
