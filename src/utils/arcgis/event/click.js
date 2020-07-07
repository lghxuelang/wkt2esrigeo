import jsapi from '../jsapi';
import layerViewProcess from './support/click-layer-view';

let defaultHandle;
// import popupHandle, { POPUP_SOURCE_CLICK } from '../popup-handle';

export function registerDefault(callback) {
  defaultHandle = callback;
}

export default async e => {
  // 禁用所有的SceneView默认行为
  e.stopPropagation();

  const [all] = await jsapi.load(['dojo/promise/all']);
  const results = await all([
    // layerViewProcess是系统原生自带的默认click行为
    layerViewProcess(e),

    // ... ...
    // 这里可以扩充其他的click之后的处理程序
  ]);
  if (results.length > 0) {
    const layerViewGraphics = results[0];
    const concatGraphics = [...layerViewGraphics];

    if (concatGraphics.length > 0) {
      if (defaultHandle) {
        defaultHandle(concatGraphics);
      }
      // popupHandle.openFeatures(POPUP_SOURCE_CLICK, filterGraphics, mapPoint);
    }
  }
};
