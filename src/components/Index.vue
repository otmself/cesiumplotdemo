<template>
  <div class="hello">
    <div class="demo-nav_panel">
      <el-button size="middle" class="demo-nav_item" v-for="(nav, key) in navs" :key="key" @click="ClickFun"
                 v-bind:type="selIndex == key ? 'primary' : ''">{{ nav }}
      </el-button>
    </div>
    <vc-viewer :show-credit="false"></vc-viewer>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    let selIndex = ref(null);
    const navs=["沙盘", "导入", "实时轨迹"];

    function ClickFun(index) {
      selIndex = index;
    }

    return {
      selIndex,
      navs,
      ClickFun
    }
  }
  //vue2写法
  // data() {
  //   return {
  //     navs: ["沙盘", "导入", "实时轨迹"],
  //     selIndex:null
  //   }
  // },
  // methods:{
  //   ClickFun(index){
  //
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  height: 100%;
  width: 100%;

  .demo-nav_panel {
    position: absolute;
    left: 0;
    width: 120px;
    z-index: 1;

    .demo-nav_item {
      display: flex;
      margin: 20px auto;
      width: 80px;
    }
  }
}
</style>
