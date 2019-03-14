<template>
  <div>
    <section id="groupSessionSettings">
      <div class="row">
        <p>To join an existing group, you need the name of the group's current session.</p>
        <p>If you don't have it, ask someone in the group to check their timer for the session name then enter it below.</p>
        <div class="twelve columns">
          <label>What is the session name for the group you want to join?</label>
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
      this.$modal.hide('joinGroupGetSessionNameModal')
      this.$modal.show('getUserNameModal')
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
