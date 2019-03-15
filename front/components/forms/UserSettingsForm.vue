<template>
  <div>
    <p>Let anyone else in the session know who you are by entering your name below.</p>
    <p class="muted">
      This is optional. If you leave it blank, other group members will see your name as "Anonymous".
    </p>
    <section>
      <div class="row">
        <div class="twelve columns">
          <label>My name is:</label>
          <input v-model="userName" class="u-full-width" type="text"></input>
        </div>
      </div>
      <div class="row">
        <button class="u-full-width" @click="setUserName">
          Go
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      userName: this.$store.state.userName
    }
  },
  methods: {
    setUserName() {
      console.log('clicked button to set name:', this.name)
      function isNullOrWhitespace(input) {
        return !input || input.replace(/\s/g, '').length < 1
      }
      this.$modal.hide('getUserNameModal')
      if (!isNullOrWhitespace(this.userName)) {
        this.$store.commit('setUserName', this.userName)
        const msg = {
          action: 'sendMessage',
          messageType: 'identify',
          data: { name: this.userName }
        }
        this.$socketManager.send(msg)
      } else {
        // white space or null. set store value back to null.
        this.$store.commit('setUserName', null)
      }
    }
  }
}
</script>
