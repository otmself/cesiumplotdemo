/**
 * Created by leedon1990s on 2020/12/26.
 * @desc 点要素
 */
import * as Cesium from "cesium/Build/Cesium/Cesium";
import { POINT } from "../../utils/PlotTypes";
class Point {
  constructor(coordinates, point, params) {
    let that = this;
    this.type = POINT;
    this.options = params || {};
    this.points = [];
    this.position = null;
    this.entities = [
      new Cesium.Entity({
        name: "plot-point",
        position: new Cesium.CallbackProperty(function() {
          return that.position;
        }),
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 4,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.clampToGround,
        },
        plot: that,
      }),
    ];
    if (point && point.length > 0) {
      that.setPoints(point);
    } else if (coordinates && coordinates.length > 0) {
      that.setCoordinates(coordinates);
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

  generate() {
    let pnt = this.points[0];
    this.setCoordinates(pnt);
  }

  setCoordinates(coordinates) {
    this.position = Cesium.Cartesian3.fromDegreesArray(coordinates)[0];
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

export default Point;
