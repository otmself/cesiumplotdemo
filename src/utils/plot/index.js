//import "./scss/index.scss";
import PlotDraw from "./core/PlotDraw";
import PlotEdit from "./core/PlotEdit";
//import PlotUtils from "./core/PlotUtils";
import * as PlotTypes from "./utils/PlotTypes";
import * as Geometry from "./geometry";
class CesiumPlot {
  constructor(viewer, options) {
    this.plotDraw = new PlotDraw(viewer, options);
    this.plotEdit = new PlotEdit(viewer, options);
    //this.plotUtils = new PlotUtils(map, options);
  }
  static PlotTypes = PlotTypes;
  static Geometry = Geometry;
}

export default CesiumPlot;
