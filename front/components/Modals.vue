<template>
  <div>
    <CreateGroupSuccessModal />
    <UserDisconnectedModal />
    <GetSessionNameModal />
    <GetUserNameModal />
    <JoinOrCreateGroupModal />
  </div>
</template>
<script>
import GetUserNameModal from '~/components/modals/GetUserNameModal.vue'
import UserDisconnectedModal from '~/components/modals/UserDisconnectedModal.vue'
import CreateGroupSuccessModal from '~/components/modals/CreateGroupSuccessModal.vue'
import GetSessionNameModal from '~/components/modals/GetSessionNameModal.vue'
import JoinOrCreateGroupModal from '~/components/modals/JoinOrCreateGroupModal.vue'
export default {
  components: {
    GetUserNameModal,
    UserDisconnectedModal,
    CreateGroupSuccessModal,
    GetSessionNameModal,
    JoinOrCreateGroupModal
  }
}
</script>
