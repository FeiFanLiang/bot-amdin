<template>
  <el-image
    style="width: 100px; height: 100px"
    class="pic-container"
    :src="url"
    :preview-src-list="srcList"
  />
</template>
<script>
export default {
  props: {
    url: String
  },
  data() {
    return {

    }
  },
  computed: {
    srcList() {
      return [this.url]
    }
  }
}
</script>
<style lang="scss">
.pic-container+.pic-container {
    margin-left: 15px;
}
</style>
