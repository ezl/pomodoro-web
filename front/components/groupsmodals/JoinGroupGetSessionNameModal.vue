<template>
  <modal name="joinGroupGetSessionName" height="auto" :scrollable="true">
    <div class="modal">
      <div class="modal-header">
        <h3>Join Group</h3>
      </div>
      <div class="modal-body">
        <GroupSessionForm />
      </div>
    </div><!-- .modal -->
  </modal>
</template>

<script>
import GroupSessionForm from '~/components/groupsmodals/GroupSessionForm.vue'
export default {
  name: 'JoinGroupGetSessionNameModal',
  components: {
    GroupSessionForm
  }
}
</script>
