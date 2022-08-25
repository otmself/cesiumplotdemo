<template>
  <div class="hello">
    <div class="demo-nav_panel"></div>
    <vc-viewer :show-credit="false"></vc-viewer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello{
  height: 100%;
  width: 100%;
  .demo-nav_panel{
    position: absolute;
    left: 0;
    width: 300px;
  }
}
</style>
