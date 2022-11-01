<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import CesiumPlot from "@/utils/plot";

export default {
  name: "cesiumMap",
  data() {
    return {
      viewer: null
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
      // baseLayerPicker: false,
      selectionIndicator: false,
      baseLayerPicker: false,
      animation: true,
      navigationHelpButton: false,
      infoBox: false,
      timeline: true,

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
    this.$emit("ready", viewer)
  }
}
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>