<template>
  <div class="hello">
    <div class="demo-nav_panel">
      <el-button size="small" class="demo-nav_item" v-for="(nav, key) in navs" :key="key" @click="ClickFun"
                 v-bind:type="selIndex === key ? 'primary' : ''">{{ nav }}
      </el-button>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>

export default {
  name: 'mapPlot',
  props: {
    msg: String
  },
  //vue2写法
  data() {
    return {
      navs: ["沙盘", "导入", "实时轨迹"],
      selIndex: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ClickFun(index) {

    },

    init() {
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
          //-70, // 东
          //0.0, // 南
          //0, // 西
          //90.0, // 北
          //更改为中国区域的初始视角
          72,
          10,
          135,
          53
      );
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 1.2;
      // const Cesium = this.Cesium
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: false,
        // baseLayerPicker: false,
        selectionIndicator: false,
        baseLayerPicker: false,
        animation: false,
        navigationHelpButton: false,
        infoBox: false,
        timeline: false,

        fullscreenButton: false,
        // sceneMode: Cesium.SceneMode.SCENE2D,
        // 连接地图服务
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          // url: window.mapUrl + ":9109/map/?z={z}&x={x}&y={y}",
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 7,
          show: false
        })
      });
      // this.utils.transformTime(this, window.viewer); //时间转换
      // this.utils.setView(window.viewer);
      this.viewer.cesiumWidget.creditContainer.style.display = "none";
      //是否开启抗锯齿
      this.viewer.scene.fxaa = true;
      this.viewer.scene.debugShowFramesPerSecond = false;
      this.viewer.scene.postProcessStages.fxaa.enabled = true;

      let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      let self = this;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  height: 100%;
  width: 100%;

  #cesiumContainer {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .demo-nav_panel {
    position: absolute;
    left: 0;
    width: 120px;
    z-index: 1;

    .demo-nav_item {
      display: flex;
      margin: 20px auto;
      width: 60px;
    }
  }
}
</style>
