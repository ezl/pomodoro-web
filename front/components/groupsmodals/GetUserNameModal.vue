<template>
  <modal name="getUserNameModal" height="auto" :scrollable="true">
    <div class="modal">
      <div class="modal-header">
        <h3>Introduce Yourself</h3>
      </div>
      <div class="modal-body">
        <UserSettingsForm />
      </div>
    </div><!-- .modal -->
  </modal>
</template>

<script>
import UserSettingsForm from '~/components/groupsmodals/UserSettingsForm.vue'
export default {
  name: 'GetUserNameModal',
  components: {
    UserSettingsForm
  }
}
</script>
