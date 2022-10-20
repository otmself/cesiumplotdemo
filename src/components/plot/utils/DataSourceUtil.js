/**
 * Created by leedon1990s on 2020/12/26.
 * @desc DataSourceUtil
 */
import * as Cesium from "../../../../public/Cesium/Cesium";

/**
 * 创建DataSource
 * @param viewer
 * @param dataSourceName
 * @param params
 * @returns {*}
 */
const createDataSource = function(viewer, dataSourceName, params) {
  try {
    if (viewer) {
      let dataSource = getDataSourceByName(viewer, dataSourceName);
      if (!(dataSource instanceof Cesium.DataSource)) {
        dataSource = null;
      }
      if (!dataSource) {
        if (params && params.create) {
          dataSource = new Cesium.CustomDataSource(dataSourceName);
        }
      }
      if (viewer && dataSource) {
        viewer.dataSources.add(dataSource);
      }
      return dataSource;
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * 根据名称获取DataSource
 * @param {*} viewer
 * @param {*} dataSourceName
 */
const getDataSourceByName = function(viewer, dataSourceName) {
  try {
    let dataSource = null;
    if (viewer) {
      let dataSources = viewer.dataSources.getByName(dataSourceName);
      if (dataSources && dataSources.length != 0) {
        dataSource = dataSources[0];
      }
    }
    return dataSource;
  } catch (e) {
    console.log(e);
  }
};

export { createDataSource, getDataSourceByName };
