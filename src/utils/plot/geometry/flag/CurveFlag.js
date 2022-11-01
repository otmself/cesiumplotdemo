/**
 * Created by FDD on 2017/9/13.
 * @desc 曲线旗标
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import { CURVEFLAG } from "../../utils/PlotTypes";
import { getBezierPoints } from "../../utils/Utils";
class CurveFlag {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = CURVEFLAG;
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
      // 上曲线起始点
      let point1 = startPoint;
      // 上曲线第一控制点
      let point2 = [
        (endPoint[0] - startPoint[0]) / 4 + startPoint[0],
        (endPoint[1] - startPoint[1]) / 8 + startPoint[1],
      ];
      // 上曲线第二个点
      let point3 = [(startPoint[0] + endPoint[0]) / 2, startPoint[1]];
      // 上曲线第二控制点
      let point4 = [
        ((endPoint[0] - startPoint[0]) * 3) / 4 + startPoint[0],
        -(endPoint[1] - startPoint[1]) / 8 + startPoint[1],
      ];
      // 上曲线结束点
      let point5 = [endPoint[0], startPoint[1]];
      // 下曲线结束点
      let point6 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
      // 下曲线第二控制点
      let point7 = [
        ((endPoint[0] - startPoint[0]) * 3) / 4 + startPoint[0],
        ((endPoint[1] - startPoint[1]) * 3) / 8 + startPoint[1],
      ];
      // 下曲线第二个点
      let point8 = [
        (startPoint[0] + endPoint[0]) / 2,
        (startPoint[1] + endPoint[1]) / 2,
      ];
      // 下曲线第一控制点
      let point9 = [
        (endPoint[0] - startPoint[0]) / 4 + startPoint[0],
        ((endPoint[1] - startPoint[1]) * 5) / 8 + startPoint[1],
      ];
      // 下曲线起始点
      let point10 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
      // 旗杆底部点
      let point11 = [startPoint[0], endPoint[1]];
      // 计算上曲线
      let curve1 = getBezierPoints([point1, point2, point3, point4, point5]);
      // 计算下曲线
      let curve2 = getBezierPoints([point6, point7, point8, point9, point10]);
      // 合并
      components = curve1.concat(curve2);
      components.push(point11);
      components.push(startPoint);
    }
    return components;
  }

  /**
   * 填充部分点位计算
   * @param {*} points
   */
  calculatePonits2(points) {
    let components = [];
    // 至少需要两个控制点
    if (points.length > 1) {
      // 取第一个
      let startPoint = points[0];
      // 取最后一个
      let endPoint = points[points.length - 1];
      // 上曲线起始点
      let point1 = startPoint;
      // 上曲线第一控制点
      let point2 = [
        (endPoint[0] - startPoint[0]) / 4 + startPoint[0],
        (endPoint[1] - startPoint[1]) / 8 + startPoint[1],
      ];
      // 上曲线第二个点
      let point3 = [(startPoint[0] + endPoint[0]) / 2, startPoint[1]];
      // 上曲线第二控制点
      let point4 = [
        ((endPoint[0] - startPoint[0]) * 3) / 4 + startPoint[0],
        -(endPoint[1] - startPoint[1]) / 8 + startPoint[1],
      ];
      // 上曲线结束点
      let point5 = [endPoint[0], startPoint[1]];
      // 下曲线结束点
      let point6 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
      // 下曲线第二控制点
      let point7 = [
        ((endPoint[0] - startPoint[0]) * 3) / 4 + startPoint[0],
        ((endPoint[1] - startPoint[1]) * 3) / 8 + startPoint[1],
      ];
      // 下曲线第二个点
      let point8 = [
        (startPoint[0] + endPoint[0]) / 2,
        (startPoint[1] + endPoint[1]) / 2,
      ];
      // 下曲线第一控制点
      let point9 = [
        (endPoint[0] - startPoint[0]) / 4 + startPoint[0],
        ((endPoint[1] - startPoint[1]) * 5) / 8 + startPoint[1],
      ];
      // 下曲线起始点
      let point10 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
      // 计算上曲线
      let curve1 = getBezierPoints([point1, point2, point3, point4, point5]);
      // 计算下曲线
      let curve2 = getBezierPoints([point6, point7, point8, point9, point10]);
      // 合并
      components = curve1.concat(curve2);
      components.push(point1);
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

export default CurveFlag;
