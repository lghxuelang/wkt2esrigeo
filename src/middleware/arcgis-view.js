import { viewUtils, esriUtils } from '@/utils/arcgis';
import sketchUtil from '@/utils/sketch';
import * as actions from '../constants/action-types';

const ags = {};
window.agsGlobal = ags;

function createView(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    switch (action.type) {
      //初始化地图
      case actions.INIT_MAP: {
        const { payload } = action;
        const { container } = payload;

        // DOM container not defined
        if (!container) break;

        // 设置proxy和portal地址
        await esriUtils.setEsriConfig({ proxyUrl: window.appcfg.proxy });

        // 创建基础底图
        const basemap = await viewUtils.createBasemap(window.basemapConfig[0]);
        const param = {
          container: container,
          basemap: basemap,
          extent: window.appcfg.jsapiConfig.initialExtent,
        };
        // 通过jsapi初始化地图容器
        ags.view = await viewUtils.initMapView(param);
        // 通过itemid初始化二维地图
        // ags.view = await viewUtils.map2d.initMapViewByPortal(window.appcfg.portal, window.appcfg.webMapId, container);
        // When initialized...
        return ags.view.when(() => {
          // after view created
        });
      }
      case actions.INIT_WEBSCENE: {
        const { payload } = action;
        const { container } = payload;

        // DOM container not defined
        if (!container) break;

        // 设置proxy和portal地址
        await esriUtils.setEsriConfig({
          proxyUrl: window.appcfg.proxy,
          portal: window.appcfg.portal,
        });
        // 创建基础底图
        const basemap = await viewUtils.createBasemap(window.basemapConfig[3]);
        const param = {
          container: container,
          basemap: basemap,
          camera: window.appcfg.jsapiConfig.initialCamera,
        };
        // 初始化场景
        ags.view = await viewUtils.initSceneView(param);
        // When initialized...
        return ags.view.when(() => {
          // after view created
          store.dispatch({ type: 'app/updateViewLoaded', payload: true });

          sketchUtil.view = ags.view;
          // load all saved sketches
          store.dispatch({ type: 'sketch/load' });
        });
      }
      case actions.SKETCH_LOAD: {
        const { payload } = action;
        sketchUtil.setData(payload);
        sketchUtil.on('edit', args => {
          const { state, oid } = args;
          if (state === 'create') {
            store.dispatch({
              type: 'sketch/updateDrawMode',
              payload: '',
            });
            store.dispatch({
              type: 'sketch/addSketchData',
              payload: oid,
            });
          } else if (state === 'update') {
            store.dispatch({
              type: 'sketch/updateSketchData',
              payload: oid,
            });
          }
        });
      }
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { createView };
