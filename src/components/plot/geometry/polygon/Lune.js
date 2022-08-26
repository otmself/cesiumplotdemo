/**
 * Created by FDD on 2017/5/24.
 * @desc 弓形
 * @Inherits ol.geom.Polygon
 */
import * as Cesium from "cesium/Build/Cesium/Cesium";
import { LUNE } from "../../utils/PlotTypes";
import * as Constants from "../../Constants";
import * as PlotUtils from "../../utils/Utils";
class Lune {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = LUNE;
    this.fixPointCount = 3;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.entities = [
      new Cesium.Entity({
        name: "plot-lune",
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
        name: "plot-lune-outline",
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
    if (this.getPointCount() < 2) {
      return false;
    } else {
      let pnts = coordinates;
      if (this.getPointCount() === 2) {
        let mid = PlotUtils.Mid(pnts[0], pnts[1]);
        let d = PlotUtils.MathDistance(pnts[0], mid);
        let pnt = PlotUtils.getThirdPoint(pnts[0], mid, Constants.HALF_PI, d);
        pnts.push(pnt);
      }
      let [pnt1, pnt2, pnt3, startAngle, endAngle] = [
        pnts[0],
        pnts[1],
        pnts[2],
        undefined,
        undefined,
      ];
      let center = PlotUtils.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
      let radius = PlotUtils.MathDistance(pnt1, center);
      let angle1 = PlotUtils.getAzimuth(pnt1, center);
      let angle2 = PlotUtils.getAzimuth(pnt2, center);
      if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
        startAngle = angle2;
        endAngle = angle1;
      } else {
        startAngle = angle1;
        endAngle = angle2;
      }
      pnts = PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
      pnts.push(pnts[0]);
      let arr = [];
      let points = pnts;
      for (let i = 0; i < points.length; i++) {
        arr = arr.concat(points[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
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

export default Lune;
