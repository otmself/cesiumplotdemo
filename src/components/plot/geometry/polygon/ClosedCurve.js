/**
 * Created by FDD on 2017/5/25.
 * @desc 闭合曲面
 * @Inherits ol.geom.Polygon
 */
import * as Cesium from "cesium/Build/Cesium/Cesium";
import { CLOSED_CURVE } from "../../utils/PlotTypes";
import * as PlotUtils from "../../utils/Utils";
import * as Constants from "../../Constants";
class ClosedCurve {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = CLOSED_CURVE;
    this.t = 0.3;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.entities = [
      new Cesium.Entity({
        name: "plot-closedcurve",
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
        name: "plot-closedcurve-outline",
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
      let pnts = this.getPoints();
      pnts.push(pnts[0], pnts[1]);
      let [normals, pList] = [[], []];
      for (let i = 0; i < pnts.length - 2; i++) {
        let normalPoints = PlotUtils.getBisectorNormals(
          this.t,
          pnts[i],
          pnts[i + 1],
          pnts[i + 2]
        );
        normals = normals.concat(normalPoints);
      }
      let count = normals.length;
      normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
      for (let i = 0; i < pnts.length - 2; i++) {
        let pnt1 = pnts[i];
        let pnt2 = pnts[i + 1];
        pList.push(pnt1);
        for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
          let pnt = PlotUtils.getCubicValue(
            t / Constants.FITTING_COUNT,
            pnt1,
            normals[i * 2],
            normals[i * 2 + 1],
            pnt2
          );
          pList.push(pnt);
        }
        pList.push(pnt2);
      }
      let points = pList;
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

export default ClosedCurve;
