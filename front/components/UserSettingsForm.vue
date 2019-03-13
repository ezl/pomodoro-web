<template>
  <div>
    <p><strong>Who are you?</strong></p>
    <section>
      <div class="row">
        <div class="twelve columns">
          <label>My name is:</label>
          <input v-model="name" class="u-full-width" type="text"></input>
        </div>
      </div>
      <div class="row">
        <button class="u-full-width" @click="setName">
          Update
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
