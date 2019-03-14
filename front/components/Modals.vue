<template>
  <div>
    <CreateGroupSuccessModal />
    <JoinGroupGetSessionNameModal />
    <GetUserNameModal />
    <JoinOrCreateGroupModal />
  </div>
</template>
<script>
import GetUserNameModal from '~/components/groupsmodals/GetUserNameModal.vue'
import CreateGroupSuccessModal from '~/components/groupsmodals/CreateGroupSuccessModal.vue'
import JoinGroupGetSessionNameModal from '~/components/groupsmodals/JoinGroupGetSessionNameModal.vue'
import JoinOrCreateGroupModal from '~/components/groupsmodals/JoinOrCreateGroupModal.vue'
export default {
  components: {
    GetUserNameModal,
    CreateGroupSuccessModal,
    JoinGroupGetSessionNameModal,
    JoinOrCreateGroupModal
  }
}
</script>
