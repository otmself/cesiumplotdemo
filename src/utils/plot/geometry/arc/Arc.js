/**
 * Created by leedon1990s on 2020/12/26.
 * @desc 标绘画弓形算法，继承线要素相关方法和属性
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import { ARC } from "../../utils/PlotTypes";
import * as PlotUtils from "../../utils/Utils";
class Arc {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = ARC;
    this.fixPointCount = 3;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.created = false;
    this.entities = [
      new Cesium.Entity({
        name: "plot-arc",
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
    if (count < 2) return;
    if (count === 2) {
      for (let i = 0; i < coordinates.length; i++) {
        arr = arr.concat(coordinates[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
    } else {
      let [pnt1, pnt2, pnt3, startAngle, endAngle] = [
        coordinates[0],
        coordinates[1],
        coordinates[2],
        null,
        null,
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
      let points = PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
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

  /**
   * 单击事件
   * @param {*} drawer
   * @param {*} event
   */
  setClickHandler(drawer, event) {
    let that = this;
    let position = drawer.viewer.camera.pickEllipsoid(
      event.position,
      drawer.viewer.scene.globe.ellipsoid
    );
    let cartographic = Cesium.Cartographic.fromCartesian(
      position,
      drawer.viewer.scene.globe.ellipsoid,
      new Cesium.Cartographic()
    );
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    if (!that.created) {
      drawer.plotDataSource.entities.add(that.getEntity());
      //that.points.push([lng, lat]);
      that.save.push([lng, lat]);
      that.setPoints(that.save);
      that.created = true;
    } else {
      //that.points.push([lng, lat]);
      that.save.push([lng, lat]);
      that.setPoints(that.save);
      if (that.save.length === 3) {
        drawer.handler.destroy();
        console.log("end");
      }
    }
  }

  /**
   * 双击事件
   * @param {*} drawer
   * @param {*} event
   */
  // eslint-disable-next-line no-unused-vars
  setDoubleClickHandler(drawer, event) {
    drawer.handler.destroy();
    console.log("end");
  }

  /**
   * 移动事件
   * @param {*} drawer
   * @param {*} event
   */
  // eslint-disable-next-line no-unused-vars
  setMouseMoveHandler(drawer, event) {
    let that = this;
    let position = drawer.viewer.camera.pickEllipsoid(
      event.endPosition,
      drawer.viewer.scene.globe.ellipsoid
    );
    if (that.created) {
      let cartographic = Cesium.Cartographic.fromCartesian(
        position,
        drawer.viewer.scene.globe.ellipsoid,
        new Cesium.Cartographic()
      );
      let lat = Cesium.Math.toDegrees(cartographic.latitude);
      let lng = Cesium.Math.toDegrees(cartographic.longitude);
      let pnts = that.save.concat([[lng, lat]]);
      that.setPoints(pnts);
    }
  }
}

export default Arc;
