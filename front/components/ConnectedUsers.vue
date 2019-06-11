<template>
  <div v-if="users.length > 1" id="connectedUsers">
    <h3>Connected Users</h3>
    <ul>
      <li
        v-for="user in users"
        :key="user.connectionId"
        :class="{ muted: user.userName === undefined }"
      >
        {{ user.userName || 'Anonymous' }}
        <span
          v-if="user.connectionId === $store.state.userId"
          class="change-name"
          @click="$modal.show('getUserNameModal')"
        >
          change name
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  }
}
</script>
<style>
#connectedUsers {
  display: block;
}
#connectedUsers li {
  list-style: circle;
  list-style-position: inside;
  margin-bottom: 0;
}
.change-name {
  color: #bbb;
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
}
</style>
