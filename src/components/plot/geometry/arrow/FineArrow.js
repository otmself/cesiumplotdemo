/**
 * Created by FDD on 2017/5/24.
 * @desc 粗单尖头箭头
 * @Inherits ol.geom.Polygon
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import { FINE_ARROW } from "../../utils/PlotTypes";
import * as PlotUtils from "../../utils/Utils";
import * as Constants from "../../Constants";
class FineArrow {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = FINE_ARROW;
    this.tailWidthFactor = 0.1;
    this.neckWidthFactor = 0.2;
    this.headWidthFactor = 0.25;
    this.headAngle = Math.PI / 8.5;
    this.neckAngle = Math.PI / 13;
    this.fixPointCount = 2;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.entities = [
      new Cesium.Entity({
        name: "plot-arrow",
        polygon: {
          hierarchy: new Cesium.CallbackProperty(function() {
            return new Cesium.PolygonHierarchy(that.positions, []);
          }, false),
          material: new Cesium.ColorMaterialProperty(Cesium.Color.GOLD),
          clampToGround: true,
          classificationType: Cesium.ClassificationType.TERRAIN,
        },
      }),
      new Cesium.Entity({
        name: "plot-arrow-outline",
        polyline: {
          show: true,
          positions: new Cesium.CallbackProperty(function() {
            return that.positions;
          }),
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.SKYBLUE,
          }),
          depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.SKYBLUE,
          }),
          width: 5,
          clampToGround: true,
        },
      }),
    ];
    if (points && points.length > 0) {
      this.setPoints(points);
    } else if (coordinates && coordinates.length > 0) {
      this.setCoordinates(coordinates);
    }
  }

  /**
   * 获取Entity
   */
  getEntities() {
    return this.entities;
  }

  /**
   * 获取标绘类型
   * @returns {*}
   */
  getPlotType() {
    return this.type;
  }

  /**
   * 执行动作
   */
  generate() {
    let coordinates = this.points;
    this.setCoordinates(coordinates);
  }

  setCoordinates(coordinates) {
    try {
      let cont = this.getPointCount();
      if (cont < 2) {
        return false;
      } else {
        let pnts = coordinates.slice(0);
        let [pnt1, pnt2] = [pnts[0], pnts[1]];
        let len = PlotUtils.getBaseLength(pnts);
        let tailWidth = len * this.tailWidthFactor;
        let neckWidth = len * this.neckWidthFactor;
        let headWidth = len * this.headWidthFactor;
        let tailLeft = PlotUtils.getThirdPoint(
          pnt2,
          pnt1,
          Constants.HALF_PI,
          tailWidth,
          true
        );
        let tailRight = PlotUtils.getThirdPoint(
          pnt2,
          pnt1,
          Constants.HALF_PI,
          tailWidth,
          false
        );
        let headLeft = PlotUtils.getThirdPoint(
          pnt1,
          pnt2,
          this.headAngle,
          headWidth,
          false
        );
        let headRight = PlotUtils.getThirdPoint(
          pnt1,
          pnt2,
          this.headAngle,
          headWidth,
          true
        );
        let neckLeft = PlotUtils.getThirdPoint(
          pnt1,
          pnt2,
          this.neckAngle,
          neckWidth,
          false
        );
        let neckRight = PlotUtils.getThirdPoint(
          pnt1,
          pnt2,
          this.neckAngle,
          neckWidth,
          true
        );
        let pList = [
          tailLeft,
          neckLeft,
          headLeft,
          pnt2,
          headRight,
          neckRight,
          tailRight,
        ];

        let points = pList;
        let arr = [];
        for (let i = 0; i < points.length; i++) {
          arr = arr.concat(points[i]);
        }
        this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 设置地图对象
   * @param map
   */
  setMap(map) {
    if (map && map instanceof Map) {
      this.map = map;
    } else {
      throw new Error("传入的不是地图对象！");
    }
  }

  /**
   * 获取当前地图对象
   * @returns {Map|*}
   */
  getMap() {
    return this.map;
  }

  /**
   * 判断是否是Plot
   * @returns {boolean}
   */
  isPlot() {
    return true;
  }

  /**
   * 设置坐标点
   * @param value
   */
  setPoints(value) {
    this.points = !value ? [] : value;
    if (this.points.length >= 1) {
      this.generate();
    }
  }

  /**
   * 获取坐标点
   * @returns {Array.<T>}
   */
  getPoints() {
    return this.points.slice(0);
  }

  /**
   * 获取点数量
   * @returns {Number}
   */
  getPointCount() {
    return this.points.length;
  }

  /**
   * 更新当前坐标
   * @param point
   * @param index
   */
  updatePoint(point, index) {
    if (index >= 0 && index < this.points.length) {
      this.points[index] = point;
      this.generate();
    }
  }

  /**
   * 更新最后一个坐标
   * @param point
   */
  updateLastPoint(point) {
    this.updatePoint(point, this.points.length - 1);
  }

  /**
   * 结束绘制
   */
  finishDrawing() {}
}

export default FineArrow;
