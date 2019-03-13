<template>
  <div>
    <h3>Groups</h3>
    <section id="groupSessionSettings">
      <div class="row">
        <div class="twelve columns">
          <label>Session Name</label>
          <input v-model="groupSessionName" class="u-full-width" type="text"></input>
        </div>
      </div>
      <div class="row">
        <button class="u-full-width" @click="joinSession">
          Join Session
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      groupSessionName: ''
    }
  },
  methods: {
    joinSession() {
      console.log(this.groupSessionName)
      const msg = {
        action: 'sendMessage',
        messageType: 'joinRequest',
        data: { sessionName: this.groupSessionName }
      }
      this.$socketManager.send(msg)
    }
  }
}
</script>
