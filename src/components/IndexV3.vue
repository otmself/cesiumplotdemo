<template>
  <div class="hello">
    <div class="demo-nav_panel">
      <el-button size="middle" class="demo-nav_item" v-for="(nav, key) in navs" :key="key" @click="ClickFun"
                 v-bind:type="selIndex == key ? 'primary' : ''">{{ nav }}
      </el-button>
    </div>
    <vc-viewer :show-credit="false" ref="vcViewer" @ready="onViewerReady"></vc-viewer>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  watch,
  computed
} from "vue";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(props, context) {
    //获取当前实例
    const {ctx, proxy} = getCurrentInstance()
    console.log(ctx)
    let selIndex = ref(null);
    const navs = ["沙盘", "导入", "实时轨迹"];
    let cesium;
    const vcViewer = ref(null);
    const onViewerReady = ({Cesium, viewer}) => {
      cesium = Cesium;
    }
    // 定义响应式data 数据
    const state = reactive({})
    console.log("*******end reactive******")
    // 定义方法
    const methods = {
      async dealData(firstResData) {
        if (firstResData.status == "finished") {
          state.collection_data = firstResData.data
          state.colection_id = firstResData.id
          // await get(api + state.colection_id).then((resData) => {
          //   state.layoutX = resData.x
          //   state.layoutY = resData.y
          //   console.log("state.layoutX" + state.layoutX)
          //   console.log("state.layoutY" + state.layoutY)
          // })
        }
      },
      // ***********async/await 实现请求同步功能**************
      async refreshData() {
        // await get(api).then(firstResData => {
        //   console.log("state.curStatus=" + firstResData.status)
        //   methods.dealData(firstResData)
        // }).catch(() => {
        //
        // })
      },
    }
    onBeforeMount(() => {
      // dom 挂载前
      console.log("*******onBeforeMount******")
    })
    onMounted(async () => {
      //dom 挂载后
      console.log("*******onMounted******")
      state.collection_id = proxy.$route.query.id
      await methods.init()
    })
    onBeforeUpdate(() => {
      //对响应式data数据有更新， 更新前
      console.log("*******onBeforeUpdate******")
    })
    onUpdated(() => {
      //对响应式data数据有更新， 更新后
      console.log("*******onUpdated******")
    })
    onBeforeUnmount(() => {
      //销毁页面组件前， 即关闭
      console.log("*******onBeforeUnmount******")
    })
    onUnmounted(() => {
      //销毁后
      console.log("*******onUnmounted******")
    })

    return {
      ...toRefs(state),
      ...methods,
      onViewerReady
    }
  },
  mounted() {
    {
      this.$refs.vcViewer.creatingPromise.then()
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
