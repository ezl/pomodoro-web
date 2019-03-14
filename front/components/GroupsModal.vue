<template>
  <div>
    <button @click="show">
      show
    </button>
    <button @click="hide">
      hide
    </button>
    <modal name="hello-world">
      hello, world!
    </modal>
  </div>
</template>

<script>
export default {
  methods: {
    show() {
      this.$modal.show('hello-world')
    },
    hide() {
      this.$modal.hide('hello-world')
    }
  }
}
</script>
