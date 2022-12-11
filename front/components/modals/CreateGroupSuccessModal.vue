<template>
  <modal
    name="createGroupSuccessModal"
    height="auto"
    :scrollable="true"
    :adaptive="true"
  >
    <div class="modal">
      <div class="modal-header">
        <h3>Start Group</h3>
        <i class="fa fa-times close-modal" @click="cancel"></i>
      </div>
      <div class="modal-body">
        <p><strong>Hooray!</strong> 🎉🎉🎉</p>
        <p>You created a group session!</p>
        <p class="margin-bottom-zero">
          Now anyone can join your session by:
        </p>
        <ol>
          <li>
            using your session name
            <code
              ><strong>{{ $store.state.sessionName }}</strong></code
            >, or
          </li>
          <li>
            entering this link directly in their browser:
            <a
              target="_blank"
              style="color: #ED6A5A;"
              href="https://www.youtube.com/watch?v=oHg5SJYRHA0"
              >Click to copy link</a
            >
          </li>
        </ol>
        <button class="u-full-width" @click="next">
          Next
        </button>
      </div>
    </div>
    <!-- .modal -->
  </modal>
</template>

<script>
export default {
  name: 'CreateGroupSuccessModal',
  methods: {
    next: function() {
      this.$modal.hide('createGroupSuccessModal')
      this.$modal.show('getUserNameModal')
    },
    cancel() {
      this.$modal.hide('createGroupSuccessModal')
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
