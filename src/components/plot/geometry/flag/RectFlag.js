/**
 * Created by FDD on 2017/9/13.
 * @desc 直角旗标（使用两个控制点直接创建直角旗标）
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import { RECTFLAG } from "../../utils/PlotTypes";
class RectFlag {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = RECTFLAG;
    this.fixPointCount = 2;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.positions2 = [];
    this.entities = [
      new Cesium.Entity({
        name: "plot-rectflag",
        polygon: {
          hierarchy: new Cesium.CallbackProperty(function() {
            return new Cesium.PolygonHierarchy(that.positions2, []);
          }, false),
          material: new Cesium.ColorMaterialProperty(Cesium.Color.GOLD),
          clampToGround: true,
          classificationType: Cesium.ClassificationType.TERRAIN,
        },
      }),
      new Cesium.Entity({
        name: "plot-polyline",
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
    let count = coordinates.slice(0);
    if (count < 2) {
      return false;
    } else {
      let arr = [];
      let points = this.calculatePonits(coordinates);
      for (let i = 0; i < points.length; i++) {
        arr = arr.concat(points[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
      let arr2 = [];
      let points2 = this.calculatePonits2(coordinates);
      for (let i = 0; i < points2.length; i++) {
        arr2 = arr2.concat(points2[i]);
      }
      this.positions2 = Cesium.Cartesian3.fromDegreesArray(arr2);
    }
  }

  /**
   * 插值点数据
   * @param points
   * @returns {Array}
   */
  calculatePonits(points) {
    let components = [];
    // 至少需要两个控制点
    if (points.length > 1) {
      // 取第一个
      let startPoint = points[0];
      // 取最后一个
      let endPoint = points[points.length - 1];
      var point1 = [endPoint[0], startPoint[1]];
      var point2 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
      var point3 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
      var point4 = [startPoint[0], endPoint[1]];
      components = [startPoint, point1, point2, point3, point4, startPoint];
    }
    return components;
  }

  calculatePonits2(points) {
    let components = [];
    // 至少需要两个控制点
    if (points.length > 1) {
      // 取第一个
      let startPoint = points[0];
      // 取最后一个
      let endPoint = points[points.length - 1];
      var point1 = [endPoint[0], startPoint[1]];
      var point2 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
      var point3 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
      components = [startPoint, point1, point2, point3, startPoint];
    }
    return components;
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

export default RectFlag;
