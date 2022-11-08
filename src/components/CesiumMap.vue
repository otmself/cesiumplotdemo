<template>
  <div id="cesiumContainer">
    <div class="demo-map_location">
      <div class="demo-map_locationItem" v-for="(item, index) in locations" :key="index">
        <span>{{item}}</span>
        <span>:{{moveLocation[index]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import CesiumPlot from "@/utils/plot";

export default {
  name: "cesiumMap",
  data() {
    return {
      viewer: null,
      locations:["经度", "纬度", "高度"],
      moveLocation:[null, null, null],
    }
  },
  methods: {},
  mounted() {
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        //-70, // 东
        //0.0, // 南
        //0, // 西
        //90.0, // 北
        //更改为中国区域的初始视角
        80,
        35,
        81,
        36
    );
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 1.2;
    // const Cesium = this.Cesium
    const viewer = new Cesium.Viewer("cesiumContainer", {
      geocoder: false,
      selectionIndicator: false,
      baseLayerPicker: false,
      animation: false,
      navigationHelpButton: false,
      infoBox: false,
      timeline: false,
      homeButton: false,
      showRenderLoopErrors: false,
      sceneModePicker: false,
      mapMode2D: Cesium.MapMode2D.ROTATE,
      fullscreenButton: false,
      sceneMode: Cesium.SceneMode.SCENE3D,
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
    viewer.cesiumWidget.creditContainer.style.display = "none";
    //是否开启抗锯齿
    viewer.scene.fxaa = true;
    viewer.scene.debugShowFramesPerSecond = false;
    viewer.scene.postProcessStages.fxaa.enabled = true;
    //
    //
    // plot = new CesiumPlot(viewer, {
    //   zoomToExtent: false
    // });
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let self = this;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // 左键单击事件：
    handler.setInputAction(function (e) {
      let pick = viewer.scene.pick(e.position);
      if (Cesium.defined(pick)) {
        // && pick.id.plot
        if (pick.id) {
          plot.plotEdit.activate(pick.id);
        } else {
          plot.plotEdit.deactivate();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    handler.setInputAction(function (movement){
      let ellipsoid = viewer.scene.globe.ellipsoid;
      let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
      //获取高度
      let height = viewer.camera.positionCartographic.height.toFixed(2);
      if (cartesian) {
        //将笛卡尔坐标转换为地理坐标
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        self.moveLocation = [longitude.toFixed(5), latitude.toFixed(5), height];
      }else {
        self.moveLocation = [null, null, height];
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.$emit("ready", viewer)
  }
}
</script>

<style scoped lang="scss">
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  .demo-map_location{
    position: absolute;
    bottom: 2px;
    right: 0;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px;
    z-index: 1;
    font-size: 14px;
    .demo-map_locationItem{
      margin: 0 2px;
      min-width: 120px;
    }
  }
}
</style>
