<template>
  <div>
    <CreateGroupSuccessModal />
    <UserDisconnectedModal />
    <JoinGroupGetSessionNameModal />
    <GetUserNameModal />
    <JoinOrCreateGroupModal />
  </div>
</template>
<script>
import GetUserNameModal from '~/components/modals/GetUserNameModal.vue'
import UserDisconnectedModal from '~/components/modals/UserDisconnectedModal.vue'
import CreateGroupSuccessModal from '~/components/modals/CreateGroupSuccessModal.vue'
import JoinGroupGetSessionNameModal from '~/components/modals/JoinGroupGetSessionNameModal.vue'
import JoinOrCreateGroupModal from '~/components/modals/JoinOrCreateGroupModal.vue'
export default {
  components: {
    GetUserNameModal,
    UserDisconnectedModal,
    CreateGroupSuccessModal,
    JoinGroupGetSessionNameModal,
    JoinOrCreateGroupModal
  }
}
</script>
