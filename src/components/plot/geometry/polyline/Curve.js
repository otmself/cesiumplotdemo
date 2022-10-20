/**
 * Created by leedon1990s on 2020/12/26.
 * @desc 标绘曲线算法
 */

import * as Cesium from "../../../../../public/Cesium/Cesium";
import { CURVE } from "../../utils/PlotTypes";
import * as PlotUtils from "../../utils/Utils";
class Curve {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = CURVE;
    this.t = 0.3;
    this.options = params || {};
    this.points = [];
    this.positions = [];
    this.entities = [
      new Cesium.Entity({
        name: "plot-curve",
        polyline: {
          show: true,
          positions: new Cesium.CallbackProperty(function() {
            return that.positions;
          }),
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.GOLD,
          }),
          depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.GOLD,
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
    let count = this.getPointCount();
    let arr = [];
    if (count < 2) {
      return false;
    } else if (count === 2) {
      for (let i = 0; i < coordinates.length; i++) {
        arr = arr.concat(coordinates[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
    } else {
      let points = PlotUtils.getCurvePoints(this.t, coordinates);
      for (let i = 0; i < points.length; i++) {
        arr = arr.concat(points[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
    }
  }

  /**
   * 设置地图对象
   * @param viewer
   */
  setViewer(viewer) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    } else {
      throw new Error("传入的不是地图对象！");
    }
  }

  /**
   * 获取当前地图对象
   * @returns {{}|*}
   */
  getViewer() {
    return this.viewer;
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
    if (this.points.length >= 2) {
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

export default Curve;
