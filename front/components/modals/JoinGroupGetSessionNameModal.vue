<template>
  <modal name="joinGroupGetSessionNameModal" height="auto" :scrollable="true">
    <div class="modal">
      <div class="modal-header">
        <h3 v-if="$store.state.joinOrCreateModalMode === 'join'">
          Join Group
        </h3>
        <h3 v-if="$store.state.joinOrCreateModalMode === 'create'">
          Start Group
        </h3>
      </div>
      <div class="modal-body">
        <GroupSessionForm />
      </div>
    </div><!-- .modal -->
  </modal>
</template>

<script>
import GroupSessionForm from '~/components/forms/GroupSessionForm.vue'
export default {
  name: 'JoinGroupGetSessionNameModal',
  components: {
    GroupSessionForm
  }
}
</script>
