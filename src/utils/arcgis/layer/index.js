import jsapi from '../jsapi';

/**
 * 根据图层的title获取图层
 * @author  lee  
 * @param {object} view  场景
 * @param {string} title  名称
 */
function getLayerByTitle(view, title) {
  const foundLayer = view.map.layers.find(lyr => {
    return lyr.title === title;
  });
  return foundLayer;
}

/**
 * 根据图层名称，控制图层显隐藏
 * @author  lee  mapviewer-04
 * @param {*} view  场景
 * @param {*} title  名称
 * @param {*} visible 显示/隐藏  true or false
 */
function setLayerVisible(view, title, visible) {
  const foundLayer = getLayerByTitle(view, title);
  foundLayer.visible = visible;
}



/**
 * 根据图层的title删除图层
 * @author  lee  mapviewer-07
 * @param {object} view  场景
 * @param {string} title  名称
 */
function removeLayerByTitle(view, title) {
  const foundLayer = view.map.layers.find(lyr => {
    return lyr.title === title;
  });
  if (foundLayer) view.map.remove(foundLayer);
}



// 当图层加载完毕的时候，将场景的extent设置为layer的extent
const zoomTolayer = (view, layer) => {
  layer.when(() => {
    if (layer && layer.fullExtent) {
      if (
        layer.fullExtent.spatialReference.wkid ===
        view.spatialReference.wkid
      ) {
        view.goTo(layer.fullExtent);
        // 直接设置地图的view，没有跳转效果
        // view.extent = layer.fullExtent;
      } else {
        jsapi.load(['esri/geometry/projection']).then(([projection]) => {
          projection.load().then(() => {
            const geom = projection.project(
              layer.fullExtent,
              view.spatialReference,
            );
            if (geom) {
              view.goTo(geom);
              // 直接设置地图的view，没有跳转效果
              // view.extent = layer.fullExtent;
            }
          });
        });
      }
    }
  })
}

const layerUtil = {
  getLayerByTitle,
  setLayerVisible,
  removeLayerByTitle,
  zoomTolayer,
};

export default layerUtil;
