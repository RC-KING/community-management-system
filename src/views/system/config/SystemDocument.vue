<template>
  <iframe :style="{height:heigth+'px'}" class="iframe" :src="src" frameborder="0"></iframe>
</template>

<script>
export default {
  data() {
    return {
      heigth: 0
    }
  },
  created() {
    console.log(this.$router)
  },
  computed: {
    src: function () {
      return this.$route.name
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.heigth = window.innerHeight - 180
    })
  }
}
</script>

<style lang="less" scoped>
.iframe {
  width: 100%;
  height: 100%;
}
</style>
