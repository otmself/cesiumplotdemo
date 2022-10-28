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
    <transition name="el-zoom-in-top">
      <div class="demo-menu_panel demo-update_panel" v-show="selIndex == 1">
        <el-upload
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="changeFile"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
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
import "./plot/utils/PolylineTrailLinkMaterialProperty"
import * as PlotTypes from "@/components/plot/utils/PlotTypes";
import {MathDistance} from "./plot/utils/Utils";
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
        }, {
          name: "清空内容",
          fun: "clearAll",
          custom: true
        }],
      fileList: [],
      selIndex: null,
      selFun: null,
      importDatas: [
        {
          lon: 80.226887,
          lat: 31.277297,
          height: 0,
          type: "Tiger",
          name: "坦克A",
          angle: 70,
          scale: 1000,
          id: "1"
        },
        {
          lon: 80.393613,
          lat: 31.185404,
          height: 0,
          type: "Tiger",
          name: "坦克B",
          angle: 90,
          scale: 1000,
          id: "2"
        },
        {
          lon: 80.233171,
          lat: 31.280754,
          height: 0,
          type: "Tiger",
          name: "坦克C",
          angle: 40,
          scale: 1000,
          id: "3"
        },
        {
          lon: 80.3769,
          lat: 31.174776,
          height: 5800,
          type: "Fighter",
          name: "战机A",
          angle: 100,
          scale: 100,
          id: "4"
        },
        {
          lon: 80.384661,
          lat: 31.291123,
          height: 8000,
          type: "Fighter",
          name: "战机B",
          angle: 70,
          scale: 100,
          id: "5"
        },
        {
          lon: 80.146071,
          lat: 31.326418,
          height: 7000,
          type: "Fighter",
          name: "战机C",
          angle: 20,
          scale: 100,
          id: "6"
        }
      ],

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
          80,
          35,
          81,
          36
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
            curvePath[i] = curvePath[i].concat([5000]);
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
              scale: 100,
              minimumPixelSize: 100,
              maximumScale: 200,
            },
            // Automatically compute the orientation from the position.
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            // orientation: new Cesium.CallbackProperty(function() {
            //   //console.log(this.getValue(viewer.clock.currentTime));
            //   return new Cesium.VelocityOrientationProperty(positionProperty);
            // }),
            path: new Cesium.PathGraphics({width: 1, material: Cesium.Color.YELLOW})
          });

          viewer.clock.startTime = start.clone();
          viewer.clock.stopTime = stop.clone();
          viewer.clock.currentTime = start.clone();
          //viewer.timeline.zoomTo(start, stop);
          // Speed up the playback speed 50x.
          viewer.clock.multiplier = 10;
          // Start playing the scene.
          viewer.clock.shouldAnimate = true;
          // viewer.trackedEntity = airplaneEntity;
          self.selFun = null;
        }
        if (fun.fun == 'GroundLinkSky') {
          const airplaneEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(80, 35.1, 5000),
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Fighter.glb",
              scale: 100,
            },
          });
          const tigerEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(80, 35, 0),
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Tiger.glb",
              scale: 1000
            },
          });

          // viewer.trackedEntity = tigerEntity;
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.20, 34.95, 16000),
            orientation: {
              heading: -45,
              pitch: -120,
              roll: 0
            },
            duration: 0
          })
          let handler = new Cesium.ScreenSpaceEventHandler(
              viewer.scene.canvas
          );
          let ellipsoid = viewer.scene.globe.ellipsoid;
          //是否开始连线
          let isLink = false
          let linkPosition = []
          let dynamicPositions = new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.fromDegreesArrayHeights(linkPosition);
          }, false)
          handler.setInputAction(function (e) {
            let pick = viewer.scene.pick(e.position);
            if (pick && Cesium.defined(pick) && pick.id) {
              const selEntity = pick.id;
              selEntity.model.silhouetteColor = Cesium.Color.yellowBright;
              selEntity.model.silhouetteSize = 2;
              if (!isLink) {
                isLink = true;
                let cartographic = ellipsoid.cartesianToCartographic(pick.id.position.getValue());
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let alt = cartographic.height;
                linkPosition = [lng, lat, alt];
                viewer.entities.add(
                    new Cesium.Entity({
                      polyline: {
                        positions: dynamicPositions,
                        width: 12,
                        arcType: Cesium.ArcType.RHUMB,
                        // clampToGround: true,
                        // material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, "./static/rockets_h.svg", 10000)

                      }
                    })
                )
                handler.setInputAction(function (move) {
                  //获取相机射线
                  let ray = viewer.scene.camera.getPickRay(move.endPosition);
                  //根据射线和场景求出在球面中的笛卡尔坐标
                  let movepick = viewer.scene.globe.pick(ray, viewer.scene);
                  //获取该浏览器坐标的顶部数据
                  let feature = viewer.scene.pick(move.endPosition);
                  // console.log(feature);
                  let cartesian = viewer.scene.pickPosition(move.endPosition);
                  if (feature == undefined && movepick) {
                    let cartesian = Cesium.Ellipsoid.WGS84.cartesianToCartographic(movepick);
                    let mlon = Cesium.Math.toDegrees(cartesian.longitude);
                    let mlat = Cesium.Math.toDegrees(cartesian.latitude);
                    let mMouseHeight = Cesium.Math.toDegrees(cartesian.height);
                    linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[mlon, mlat, mMouseHeight]];
                  } else {
                    if (Cesium.defined(cartesian)) {
                      //如果对象已定义，将度转为经纬度
                      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                      let mlon = Cesium.Math.toDegrees(cartographic.longitude);
                      let mlat = Cesium.Math.toDegrees(cartographic.latitude);
                      let mMouseHeight = cartographic.height;//模型高度
                      linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[mlon, mlat, mMouseHeight]];
                    }
                  }
                  //
                  // let movepick = viewer.scene.pick(move.endPosition);
                  // let cartesian = viewer.camera.pickEllipsoid(move.endPosition, ellipsoid);
                  // if (cartesian) {
                  //   //将笛卡尔三维坐标转为地图坐标（弧度）
                  //   let ecartographic = ellipsoid.cartesianToCartographic(cartesian);
                  //   let elat = Cesium.Math.toDegrees(ecartographic.latitude);
                  //   let elng = Cesium.Math.toDegrees(ecartographic.longitude);
                  //   let ealt = ecartographic.height;
                  //   if (movepick && Cesium.defined(movepick) && movepick.id) {
                  //     let targetcartographic = ellipsoid.cartesianToCartographic(movepick.id.position.getValue())
                  //     elat = Cesium.Math.toDegrees(targetcartographic.latitude);
                  //     elng = Cesium.Math.toDegrees(targetcartographic.longitude);
                  //     ealt = targetcartographic.height;
                  //   }
                  //   // linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[elng, elat, ealt]];
                  //   //将地图坐标（弧度）转为十进制的度数
                  // }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
              } else {
                isLink = false
                handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
              }
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          self.selFun = null;
        }
        if (fun.fun == "clearAll") {
          viewer.dataSources.get(0).entities.removeAll();
          viewer.entities.removeAll();
          self.selFun = null;
        }
      } else {
        plot.plotDraw.active(fun.fun, {}, function (data) {
          if (data == 1) {
            self.selFun = null;
          }
        })
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    changeFile(file) {
      const datas = this.importDatas;
      let entities = [];
      datas.forEach(data => {
        let position = Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height)
        entities.push(viewer.entities.add({
          id: data.id,
          name: data.name,
          position: position,
          orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(data.angle - 90), Cesium.Math.toRadians(0),
              Cesium.Math.toRadians(0))),
          // Attach the 3D model instead of the green point.
          label: {
            // This callback updates the length to print each frame.
            text: data.name,
            font: "14px sans-serif",
            fillColor: Cesium.Color.fromCssColorString("#ff0"),
            outlineColor: Cesium.Color.RED,
            outlineWidth: 1,
            eyeOffset: new Cesium.Cartesian3(0, 200, 100),
            scaleByDistance: new Cesium.NearFarScalar(15000, 1.2, 5000, 1),
          },
          model: {
            uri: "./model/" + data.type + ".glb",
            scale: data.scale,
          },
        }))
      })
      viewer.flyTo(entities)
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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

  .demo-update_panel {
    width: 250px;
    text-align: center;
    margin-left: 55px;
  }
}
</style>
