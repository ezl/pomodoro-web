<template>
  <div>
    <p>
      Let anyone else in the group session know who you are by entering your
      name below.
    </p>
    <p class="muted">
      This is optional. If you leave it blank, other group members will see your
      name as "Anonymous".
    </p>
    <section>
      <div class="row">
        <div class="twelve columns">
          <label>My name is:</label>
          <input
            ref="userName"
            v-model="userName"
            class="u-full-width"
            type="text"
            @keyup.enter="setUserName"
          />
        </div>
      </div>
      <div class="row">
        <button class="u-full-width" @click="setUserName">
          Enter Session
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { isNullOrWhitespace } from '~/lib/utils'
export default {
  data: function() {
    return {
      userName: this.$store.state.userName
    }
  },
  mounted() {
    this.$refs.userName.focus()
  },
  methods: {
    setUserName() {
      this.$modal.hide('getUserNameModal')
      if (!isNullOrWhitespace(this.userName)) {
        this.$store.commit('setUserName', this.userName)
        const msg = {
          action: 'sendMessage',
          messageType: 'identify',
          data: { userName: this.userName }
        }
        console.log('fffff', msg)
        this.$socketManager.send(msg)
        console.log('send')
      } else {
        // white space or null. set store value back to null.
        this.$store.commit('setUserName', '')
      }
    }
  }
}
</script>
