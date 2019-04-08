<template>
  <div>
    <section v-if="$store.state.joinOrCreateModalMode === 'join'">
      <p>
        To join an existing group, you need the name of the group's current
        session.
      </p>
      <p>
        If you don't have it, ask someone in the group to check their timer for
        the session name then enter it below.
      </p>
      <div class="row">
        <div class="twelve columns">
          <label
            >What is the session name for the group you want to join?</label
          >
          <input v-model="groupSessionName" class="u-full-width" type="text" />
        </div>
      </div>
      <div class="row">
        <button
          class="u-full-width"
          :disabled="isNullOrWhitespace(groupSessionName)"
          @click="joinSession"
        >
          Join Session
        </button>
      </div>
    </section>
    <section v-if="$store.state.joinOrCreateModalMode === 'create'">
      <p>
        Choose a name for your session, which will allow others to join your
        session.
      </p>
      <p>
        If there is already a session with the same name, you'll be added to
        that session.
      </p>
      <div class="row">
        <div class="twelve columns">
          <label>What name do you want to use for your session?</label>
          <input v-model="groupSessionName" class="u-full-width" type="text" />
        </div>
      </div>
      <div class="row">
        <button
          class="u-full-width"
          :disabled="isNullOrWhitespace(groupSessionName)"
          @click="joinSession"
        >
          Start Session
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { isNullOrWhitespace } from '@/lib/utils'
export default {
  data: function() {
    return {
      groupSessionName: ''
    }
  },
  methods: {
    isNullOrWhitespace(val) {
      return isNullOrWhitespace(val)
    },
    joinSession() {
      this.$modal.hide('getSessionNameModal')

      if (this.$store.state.joinOrCreateModalMode === 'join') {
        this.$modal.show('getUserNameModal')
      } else if (this.$store.state.joinOrCreateModalMode === 'create') {
        this.$modal.show('createGroupSuccessModal')
      }
      if (!isNullOrWhitespace(this.groupSessionName)) {
        const msg = {
          action: 'sendMessage',
          messageType: 'joinRequest',
          data: { sessionName: this.groupSessionName }
        }
        this.$socketManager.send(msg)
        this.$store.dispatch('setSession', this.groupSessionName)
      }
    }
  }
}
</script>
