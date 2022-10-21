<template>
  <div class="hello">
    <div class="demo-nav_panel">
      <el-button size="medium" class="demo-nav_item" v-for="(nav, key) in navs" :key="key" @click="openMenu(key)"
                 :type="selIndex === key ? 'primary' : ''">{{ nav }}
      </el-button>
    </div>
    <transition name="el-zoom-in-top">
      <div class="demo-menu_panel" v-show="selIndex == 0">
        <el-button v-for="plot in plots" :key="plot.fun" size="small" @click="drawPlot(plot)"
                   :type="selFun == plot.fun ? 'primary' : ''" class="demo-menu_item">{{ plot.name }}
        </el-button>
      </div>
    </transition>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import "../../public/Cesium/Widgets/widgets.css";
import CesiumPlot from "./plot/index";
import * as Utils from "./plot/utils/Utils";
// eslint-disable-next-line no-unused-vars


let viewer = null;
let plot = null;
export default {
  name: 'mapPlot',
  props: {
    msg: String
  },
  //vue2写法
  data() {
    return {
      navs: ["沙盘", "导入", "实时轨迹"],
      plots: [
        {
          name: "点",
          fun: "Point"
        }, {
          name: "线",
          fun: "Polyline"
        }, {
          name: "曲线",
          fun: "Curve"
        }, {
          name: "弓形线",
          fun: "Arc"
        }, {
          name: "圆",
          fun: "Circle"
        }, {
          name: "自由线",
          fun: "FreeHandLine"
        }, {
          name: "矩形",
          fun: "RectAngle"
        }, {
          name: "椭圆",
          fun: "Ellipse"
        }, {
          name: "弓型面",
          fun: "Lune"
        }, {
          name: "扇形",
          fun: "Sector"
        }, {
          name: "闭合曲面",
          fun: "ClosedCurve"
        }, {
          name: "多边形",
          fun: "Polygon"
        }, {
          name: "自由面",
          fun: "FreePolygon"
        }, {
          name: "集结地",
          fun: "GatheringPlace"
        }, {
          name: "钳击",
          fun: "DoubleArrow"
        }, {
          name: "细直箭头",
          fun: "StraightArrow"
        }, {
          name: "粗单尖头箭头",
          fun: "FineArrow"
        }, {
          name: "进攻方向",
          fun: "AttackArrow"
        }, {
          name: "粗单直箭头",
          fun: "AssaultDirection"
        }, {
          name: "进攻方向(尾)",
          fun: "TailedAttackArrow"
        }, {
          name: "分队战斗行动",
          fun: "SquadCombat"
        }, {
          name: "分队战斗行动(尾)",
          fun: "TailedSquadCombat"
        }, {
          name: "矩形标志旗",
          fun: "RectFlag"
        }, {
          name: "三角标志旗",
          fun: "TriangleFlag"
        }, {
          name: "曲线标志旗",
          fun: "CurveFlag"
        }, {
          name: "飞行轨迹",
          fun: "fly",
          custom: true
        }, {
          name: "地空目标",
          fun: "GroundLinkSky",
          custom: true
        }],
      selIndex: null,
      selFun: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    openMenu(index) {
      this.selIndex = index
    },
    init() {
      let self = this;
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
      viewer = new Cesium.Viewer("cesiumContainer", {
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


      plot = new CesiumPlot(viewer, {
        zoomToExtent: false
      });
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
    },
    drawPlot(fun) {
      this.selFun = fun.fun;
      let self = this;
      if (fun.custom) {
        if (fun.fun == 'fly') {
          let points = [
            [80.875854, 35.496456],
            [80.445415, 35.426961],
            [80.364565, 35.620685],
            [80.786978, 35.829093]
          ]
          let curvePath = Utils.getCurvePoints(0.3, points);
          let range = [80.875854, 35.496456, 80.445415, 35.426961, 80.364565, 35.620685, 80.786978, 35.829093];
          range = Cesium.Rectangle.fromCartesianArray(Cesium.Cartesian3.fromDegreesArray(range));
          let boundingSphere = Cesium.BoundingSphere.fromRectangle3D(range);
          viewer.camera.flyToBoundingSphere(boundingSphere, {
            offset: new Cesium.HeadingPitchRange(0, -90, 100000)
          })
          for (let i = 0; i < curvePath.length; i++) {
            curvePath[i] = curvePath[i].concat([7950]);
            // if (i > 10 && i < curvePath.length - 10) {
            //   height = height + 10;
            // }
          }
          const timeStepInSeconds = 30;
          const totalSeconds = timeStepInSeconds * (curvePath.length - 1);
          const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
          const stop = Cesium.JulianDate.addSeconds(
              start,
              totalSeconds,
              new Cesium.JulianDate()
          );

          const positionProperty = new Cesium.SampledPositionProperty();
          for (let i = 0; i < curvePath.length; i++) {
            const dataPoint = curvePath[i];
            const time = Cesium.JulianDate.addSeconds(
                start,
                i * timeStepInSeconds,
                new Cesium.JulianDate()
            );
            const position = Cesium.Cartesian3.fromDegrees(
                dataPoint[0],
                dataPoint[1],
                dataPoint[2]
            );
            positionProperty.addSample(time, position);
          }

          const airplaneEntity = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
              new Cesium.TimeInterval({start: start, stop: stop})
            ]),
            position: positionProperty,
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Fighter.glb",
              scale: 10,
              minimumPixelSize: 10,
              maximumScale: 20,
            },
            // Automatically compute the orientation from the position.
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            // orientation: new Cesium.CallbackProperty(function() {
            //   //console.log(this.getValue(viewer.clock.currentTime));
            //   return new Cesium.VelocityOrientationProperty(positionProperty);
            // }),
            path: new Cesium.PathGraphics({width: 1})
          });

          viewer.clock.startTime = start.clone();
          viewer.clock.stopTime = stop.clone();
          viewer.clock.currentTime = start.clone();
          //viewer.timeline.zoomTo(start, stop);
          // Speed up the playback speed 50x.
          viewer.clock.multiplier = 10;
          // Start playing the scene.
          viewer.clock.shouldAnimate = true;
          viewer.trackedEntity = airplaneEntity;
        }
      } else {
        plot.plotDraw.active(fun.fun, {}, function (data) {
          if (data == 1) {
            self.selFun = null;
          }
        })
      }
    }
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
    width: 360px;
    z-index: 1;
    text-align: center;

    .demo-nav_item {
      margin: 20px 2px;
      width: 80px;
    }
  }

  .demo-menu_panel {
    position: absolute;
    left: 0;
    z-index: 1;
    background: white;
    padding: 20px;
    border-radius: 5px;
    top: 60px;
    width: 360px;

    .demo-menu_item {
      margin: 10px;
    }
  }
}
</style>
