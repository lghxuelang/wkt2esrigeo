import jsapi from '../jsapi';
import { layerCreator } from '@/utils/arcgis';
import geometryUtils from '../geometry';
/**
 * 判断当前view是否准备好
 * @author  lwei
 * @param
 * @returns {object}  promise
 */
export function isViewReady() {
  let timer;
  if (window.agsGlobal.view) {
    return new Promise(resolve => resolve(window.agsGlobal.view));
  }
  return new Promise(reslove => {
    timer = setInterval(() => {
      if (window.agsGlobal.view) {
        clearInterval(timer);
        reslove(window.agsGlobal.view);
      }
    }, 300);
  });
};

/**
 * 初始化底图
 * @author  lee
 * @param {object} opt  设置底图的参数
 * @returns {object}  basemap 底图
 */
async function createBasemap(opt) {
  const [Basemap] = await jsapi.load(['esri/Basemap']);

  const baseLayers = [];
  for (let i = 0; i < opt.baseLayers.length; i++) {
    const lyr = await layerCreator.create(opt.baseLayers[i]);
    baseLayers.push(lyr);
  }

  var basemap = new Basemap({
    baseLayers: baseLayers,
    title: opt.title,
    id: opt.id
  });
  return basemap;
}
/**
 * 初始化二维场景
 * @author  lee
 * @param {object} opt  portal container extent
 * @returns {object}  view 场景
 */
async function initMapView(opt) {
  const [Map, MapView] = await jsapi.load([
    'esri/Map',
    'esri/views/MapView',
  ]);

  const map = new Map({
    basemap: opt.basemap || 'dark-gray-vector',
  });

  const view = new MapView({
    container: opt.container,
    map: map,
    ui: {
      components: [],
    },
    zoom: 8,
    popup: {
      defaultPopupTemplateEnabled: true, // 自动创建要素图层的popuptemplate
    },
  });
  if (opt.extent) {
    const extent = await geometryUtils.jsonToExtent(opt.extent);
    view.extent = extent;
  }

  return view;
}

/**
 * 初始化二维场景
 * @author  lee
 * @param {object} portal  portal地址
 * @param {string} itemid  webmapId
 * @param {string} container  地图的div
 * @returns {object}  view 场景
 */
async function initMapViewByPortal(portal, itemid, container) {
  const [WebMap, MapView] = await jsapi.load(['esri/WebMap', 'esri/views/MapView']);
  const webmap = new WebMap({
    portalItem: {
      id: itemid,
      portal: portal,
    },
  });
  const view = new MapView({
    container: container,
    map: webmap,
    ui: {
      components: [],
    },
  });
  return view;
}

/**
 * 初始化二维场景
 * @author  lee  mapviewer-01
 * @param {object} opt  portal container extent
 * @returns {object}  view 场景
 */
async function initSceneView(opt) {
  const [Map, ScenesView] = await jsapi.load([
    'esri/Map',
    'esri/views/SceneView',
  ]);

  const map = new Map({
    basemap: opt.basemap || 'dark-gray-vector',
  });

  if (opt.layers) {
    map.layers = opt.layers
  }

  const view = new ScenesView({
    container: opt.container,
    map: map,
    ui: {
      components: [],
    },
    popup: {
      defaultPopupTemplateEnabled:true,
      collapseEnabled:false,
      actions:[],
      featureNavigationEnabled:false,
      dockOptions:{
        buttonEnabled:false,
      }
    },
  });
  if (opt.camera) {
    view.camera = opt.camera;
  }
  return view;
}
/**
 * 初始化三维场景
 * @author  lee
 * @param {object} portal  portal地址
 * @param {string} itemid  webscenenId
 * @param {string} container  地图的div
 */
async function initSceneViewByPortal(portal, itemid, container) {
  const [WebScene, Sceneview] = await jsapi.load(['esri/WebScene', 'esri/views/SceneView']);
  const scene = new WebScene({
    portalItem: {
      id: itemid,
      portal: portal,
    },
  });

  const view = new Sceneview({
    container: container,
    map: scene,
    environment: {
      atmosphere: {
        // creates a realistic view of the atmosphere
        quality: 'high',
      },
    },
    ui: {
      components: [], // 'zoom', 'navigation-toggle', 'compass'
    },
    popup: {
      autoOpenEnabled: false,
      collapsed: false,
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "bottom-center"
      }
    },
  });
  return view;
}

/**
 * 通过webmapid 切换地图的webmap
 * @author  lee
 * @param {object} portal  portal
 * @param {object} view 场景
 * @param {string} webmapId webmap的itmid
 */
async function swapWebmap(portal, view, webmapId, ) {
  const [WebMap] = await jsapi.load(['esri/WebMap']);
  const webmap = new WebMap({
    portalItem: {
      id: webmapId,
      portal: portal,
    },
  });
  view.map = webmap;
}

/**
 * 通过webmapid 切换底图  适用于二三维场景
 * @author  lee
 * @param {object} view 场景
 * @param {string} webmapId webmap的itmid
 */
async function switchBaseMapByWebmapId(view, webmapId) {
  const [WebMap] = await jsapi.load(['esri/WebMap']);
  const map = new WebMap({
    portalItem: {
      id: webmapId,
    },
  });
  map.load().then(function () {
    map.basemap.load().then(function () {
      view.map.basemap = map.basemap;
    });
  });
}




/**
 * 环绕漫游（heading）比如：沿着建筑漫游
 * @author  lee  sceneviewer-02
 * @param {object} view  三维场景
 */
let roamHandle
function roamByHeading(view) {
  if (roamHandle) {
    clearInterval(roamHandle);
    roamHandle = null;
  } else {
    roamHandle = setInterval(() => {
      view.goTo({ heading: view.camera.heading + 0.5 });
    }, 100);
  }

}
/**
 * 环绕漫游 环绕漫游（longitude）比如：整个地图旋转
 * @author  lee  sceneviewer-03
 * @param {object} view  三维场景
 */
let roamByLongtitudeInterval;
function roamByLongtitude(view) {
  if (roamByLongtitudeInterval) {
    clearInterval(roamByLongtitudeInterval);
    roamByLongtitudeInterval = null;
  } else {
    roamByLongtitudeInterval = setInterval(() => {
      const camera = view.camera.clone();
      camera.position.longitude += 5;
      view.goTo(camera);
    }, 100);
  }
}

const viewUtil = {
  isViewReady,
  createBasemap,
  initMapView,
  initMapViewByPortal,
  initSceneView,
  initSceneViewByPortal,
  swapWebmap,
  switchBaseMapByWebmapId,
  roamByHeading,
  roamByLongtitude,
};

export default viewUtil;
