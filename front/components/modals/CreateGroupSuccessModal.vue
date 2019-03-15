<template>
  <modal name="createGroupSuccessModal" height="auto" :scrollable="true">
    <div class="modal">
      <div class="modal-header">
        <h3>Start Group</h3>
      </div>
      <div class="modal-body">
        <p><strong>Hooray!</strong> 🎉🎉🎉</p>
        <p>You created a group session!</p>
        <p class="margin-bottom-zero">
          Now anyone can join your session by:
        </p>
        <ol>
          <li>using your session name <code><strong>group-session-name</strong></code>, or</li>
          <li>entering this link directly in their browser: <a href="https://www.google.com">https://foobar.com</a></li>
        </ol>
        <button class="u-full-width" @click="next">
          Thank U, Next!
        </button>
      </div>
    </div><!-- .modal -->
  </modal>
</template>

<script>
export default {
  name: 'CreateGroupSuccessModal',
  methods: {
    next: function() {
      this.$modal.hide('createGroupSuccessModal')
      this.$modal.show('getUserNameModal')
    }
  }
}
</script>
<style>
.modal-body li {
  margin-bottom: 0;
  margin-left: 1.5rem;
}
.margin-bottom-zero {
  margin-bottom: 0;
}
</style>
