<template>
  <div>
    <p>Let anyone else in the session know who you are by entering your name below.</p>
    <p class="muted">This is optional. If you leave it blank, other group members will see your name as "Anonymous".</p>
    <section>
      <div class="row">
        <div class="twelve columns">
          <label>My name is:</label>
          <input v-model="name" class="u-full-width" type="text"></input>
        </div>
      </div>
      <div class="row">
        <button class="u-full-width" @click="setName">
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
      name: ''
    }
  },
  methods: {
    setName() {
      this.$modal.hide('getUserNameModal')
      console.log('clicked button to set name:', this.name)
      const msg = {
        action: 'sendMessage',
        messageType: 'identify',
        data: { name: this.name }
      }
      this.$socketManager.send(msg)
    }
  }
}
</script>
