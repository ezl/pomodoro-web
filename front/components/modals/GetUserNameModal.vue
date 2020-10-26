<template>
  <modal
    name="getUserNameModal"
    height="auto"
    :scrollable="true"
    :adaptive="true"
  >
    <div class="modal">
      <div class="modal-header">
        <h3>Introduce Yourself</h3>
        <i class="fa fa-times close-modal" @click="cancel"></i>
      </div>
      <div class="modal-body">
        <UserSettingsForm />
      </div>
    </div>
    <!-- .modal -->
  </modal>
</template>

<script>
import UserSettingsForm from '~/components/forms/UserSettingsForm.vue'
export default {
  name: 'GetUserNameModal',
  components: {
    UserSettingsForm
  },
  methods: {
    hide(modalName) {
      this.$modal.hide(modalName)
    },
    cancel() {
      this.hide('getUserNameModal')
    }
  }
}
</script>
