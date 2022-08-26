// eslint-disable-next-line no-unused-vars
import { BASE_HELP_CONTROL_POINT_ID, BASE_HELP_HIDDEN } from "../Constants";
import * as Cesium from "cesium/Build/Cesium/Cesium";

class PlotEdit {
    constructor(viewer) {
        if (viewer && viewer instanceof Cesium.Viewer) {
            this.viewer = viewer;
        } else {
            throw new Error("传入的不是地图对象！");
        }
        /**
         * 激活绘制工具
         * @type {null}
         */
        this.activePlot = null;
        /**
         * 开始点
         * @type {null}
         */
        this.startPoint = null;
        /**
         * clone的控制点
         * @type {null}
         */
        this.ghostControlPoints = null;
        /**
         * 控制点
         * @type {null}
         */
        this.controlPoints = null;
        /**
         * 鼠标移入
         * @type {boolean}
         */
        this.mouseOver = false;
        /**
         * 元素
         * @type {{}}
         */
        this.elementTable = {};
        /**
         * 当前激活的控制点的ID
         * @type {null}
         */
        this.activeControlPointId = null;
        /**
         * 地图拖拽交互
         * @type {null}
         */
        this.mapDragPan = null;
        /**
         * 未激活之前鼠标样式
         * @type {null}
         * @private
         */
        this.previousCursor_ = null;

        /**
         * 鼠标事件句柄
         */
        this.handle = null;

        /**
         * 控制点被选中
         */
        this.controlPointSelected = false;
    }

    /**
     * 激活工具
     * @param plot (entity)
     * @returns {boolean}
     */
    activate(plot) {
        let that = this;
        if (plot !== that.activePlot) {
            that.deactivate();
            if (!that.handle) {
                that.handle = new Cesium.ScreenSpaceEventHandler(
                    that.viewer.scene.canvas
                );
            }
            that.activePlot = plot;
            // 光标改变
            that.previousCursor_ = that.viewer.scene.canvas.style.cursor;
            // 初始化鼠标点击拖动等复合事件
            // 左键单击事件：针对控制点的操作
            // eslint-disable-next-line no-unused-vars
            that.handle.setInputAction(function (e) {
                var pick = that.viewer.scene.pick(e.position);
                if (Cesium.defined(pick)) {
                    if (pick.id && pick.id.isControl) {
                        that.viewer.scene.canvas.style.cursor = "move";
                        that.controlPointSelected = true;
                        that.enableMapDragPan();
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            // 左键弹起事件
            // eslint-disable-next-line no-unused-vars
            that.handle.setInputAction(function (e) {
                var pick = that.viewer.scene.pick(e.position);
                if (Cesium.defined(pick)) {
                    if (pick.id && pick.id.isControl) {
                        that.viewer.scene.canvas.style.cursor = "default";
                        that.controlPointSelected = false;
                        that.disableMapDragPan();
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP);

            // 移动事件：
            // eslint-disable-next-line no-unused-vars
            that.handle.setInputAction(function (e) {
                var pick = that.viewer.scene.pick(e.position);
                if (Cesium.defined(pick)) {
                    if (pick.id && pick.id.isControl && that.controlPointSelected) {
                        that.viewer.scene.canvas.style.cursor = "move";
                        console.log(e.endPosition);
                    }
                }
                // that.plotMouseOverOutHandler(e);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            // 初始化军标控制点
        }

        // 左键按下事件
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) { },
            Cesium.ScreenSpaceEventType.LEFT_DOWN);



        // 左键双击事件：
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) { },
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // 右键单击事件
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) {
            if (that.handler) {
                that.handler.destroy();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        // 右键按下事件
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) { },
            Cesium.ScreenSpaceEventType.RIGHT_DOWN);

        // 右键弹起事件
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) { },
            Cesium.ScreenSpaceEventType.RIGHT_UP);
    }

    /**
     * 取消激活工具
     */
    deactivate() {
        this.activePlot = null;
        this.mouseOver = false;
        this.viewer.scene.canvas.style.cursor = this.previousCursor_;
        this.previousCursor_ = null;
        // this.destroyHelperDom();
        // this.disconnectEventHandlers();
        // this.enableMapDragPan();
        this.elementTable = {};
        this.activeControlPointId = null;
        this.startPoint = null;
    }

    /**
     * 鼠标移出要编辑的要素范围
     * @param e
     * @returns {T|undefined}
     */
    plotMouseOverOutHandler(e) {
        let that = this;
        let pick = this.viewer.scene.pick(e.endPosition);
        if (Cesium.defined(pick)) {
            if (pick.id && pick.id.plot) {
                if (pick.id === that.activePlot) {
                    if (!that.mouseOver) {
                        that.mouseOver = true;
                        that.viewer.scene.canvas.style.cursor = "move";
                        that.handle.setInputAction(function (e) {
                            that.plotMouseDownHandler(e);
                        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                    }
                }
            }
        } else {
            if (that.mouseOver) {
                that.mouseOver = false;
                that.viewer.scene.canvas.style.cursor = "default";
                that.handle.setInputAction(function (e) {
                    that.plotMouseDownHandler(e);
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            }
        }
        return pick;
    }

    /**
     * 在要编辑的要素按下鼠标按键
     * @param event
     */
    plotMouseDownHandler(e) {
        let that = this;
        that.ghostControlPoints = that.getControlPoints();
        that.startPoint = e.position;
        that.disableMapDragPan();
        // 左键弹起事件
        // eslint-disable-next-line no-unused-vars
        that.handle.setInputAction(function (e) {
            that.plotMouseUpHandler();
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    /**
     * 鼠标抬起事件
     * @param e
     */
    // eslint-disable-next-line no-unused-vars
    plotMouseUpHandler(e) {
        this.enableMapDragPan();
    }

    /**
     * 获取要素的控制点
     * @returns {Array}
     */
    getControlPoints() {
        let points = [];
        if (this.activePlot) {
            points = this.activePlot.plot.getPoints();

        }
        return points;
    }

    /**
     * 禁止地图的拖拽平移
     */
    disableMapDragPan() {
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
        this.viewer.scene.screenSpaceCameraController.enableTilt = false;
    }

    /**
     * 激活地图的拖拽平移
     */
    enableMapDragPan() {
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
        this.viewer.scene.screenSpaceCameraController.enableTilt = true;
    }
}
export default PlotEdit;
