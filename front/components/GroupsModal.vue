<template>
  <div id="groups">
    <a @click="showJoinOrCreateGroupModal">Start or Join a Pomodoro Party</a>
    <JoinOrCreateGroupModal />
  </div>
</template>

<script>
import JoinOrCreateGroupModal from '~/components/groupsmodals/JoinOrCreateGroupModal.vue'

export default {
  components: {
    JoinOrCreateGroupModal
  },
  methods: {
    showJoinOrCreateGroupModal() {
      this.$modal.show('joinOrCreateGroupModal')
    }
  }
}
</script>
<style>
#groups {
  padding-top: 50px;
  text-align: center;
}
</style>
