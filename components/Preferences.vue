<template>
  <div>
    <div>
      <span>work time</span><input v-model="preferences.workDuration" type="number"></input>
    </div>
    <div>
      <span>rest time</span><input v-model="preferences.restDuration" type="number"></input>
    </div>
    <div>
      <span>autostart</span><input v-model="preferences.autoStartNextSession" type="checkbox"></input>
    </div>
    <button @click="savePreferences(true)">
      Save Preferences
    </button>
    <button @click="sendPreferences">
      Send Preferences
    </button>
  </div>
</template>

<script>
export default {
  components: {},
  data: function() {
    return {
      preferences: {
        workDuration: 10,
        restDuration: 10,
        autoStartNextSession: true
      }
    }
  },
  methods: {
    sendPreferences: function() {
      console.log('clicked send preferences')
      /*
      const payload = {
        action: 'sendmessage',
        messageType: 'preferences',
        data: this.$store.state.timer.preferences
      }
      const message = JSON.stringify(payload)
      this.$socketManager.websocket.send(message)
      */
    },
    savePreferences: function(broadcast = false) {
      console.log('clicked save preferences', broadcast)
      this.$store.commit('setPreferences', this.preferences)
      /*
      // this.$store.state.timer.preferences = this.preferences
      this.$store.state.timer.reset() <--
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendPreferences()
      }
      */
    }
  }
}
</script>
