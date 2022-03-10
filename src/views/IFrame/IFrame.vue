<template>
  <iframe :src="src"></iframe>
</template>

<script>
export default {
  created() {
    console.log(this.$router)
  },
  computed: {
    src: function () {
      return this.$router.name
    }
  }
}
</script>

<style lang="less" scoped>
</style>
