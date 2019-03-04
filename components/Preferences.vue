<template>
  <div>
    <h3>Settings</h3>
    <section id="preferencesForm">
      <div class="row">
        <div class="six columns">
          <label>Work time</label>
          <input v-model="preferencesForm.workDuration" class="u-full-width" type="number">
        </div>
        <div class="six columns">
          <label>Rest time</label>
          <input v-model="preferencesForm.restDuration" class="u-full-width" type="number">
        </div>
      </div>
      <div class="row">
        <label>
          <input v-model="preferencesForm.autoStartNextSession" type="checkbox">
          <span class="label-body">Automatically start next session</span>
        </label>
      </div>
      <div class="row">
        <div class="six columns">
          <button class="u-full-width" @click="savePreferences(true)">
            Save
          </button>
        </div>
        <div class="six columns">
          <button class="u-full-width">
            Cancel
          </button>
        </div>
        <button style="display:none;" @click="sendPreferences">
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
      preferencesForm: {}
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
    sendPreferences: function() {
      console.log('clicked send preferences')
      const payload = {
        action: 'sendmessage',
        messageType: 'preferences',
        data: this.$store.state.preferences
      }
      const message = JSON.stringify(payload)
      this.$socketManager.send(message)
    },
    savePreferences: function(broadcast = false) {
      console.log('clicked save preferences', broadcast)
      this.$store.commit('setPreferencesFromMinutes', this.preferencesForm)
      /*
      this.$store.state.timer.reset() <--
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendPreferences()
      }
      */
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
