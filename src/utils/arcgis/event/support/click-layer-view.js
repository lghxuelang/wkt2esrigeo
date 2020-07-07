import _ from 'lodash';

import jsapi from '../../jsapi';

export default evt => {
  return new Promise((resolve, reject) => {
    const screenPoint = evt.screenPoint;
    const view = window.agsGlobal.view;
    const popupVm = view.popup.viewModel;

    popupVm._cancelFetchingFeatures();
    popupVm._fetchingFeatures = popupVm._fetchFeatures(screenPoint).then(async result => {
      const { promises } = result;
      popupVm._fetchingFeatures = null;
      const [all] = await jsapi.load(['dojo/promise/all']);
      all(
        promises.map(p => {
          return new Promise(r => {
            p.then(r, () => {
              r([]);
            });
          });
        })
      ).then(allResponse => {
        const graphics = _.concat(...allResponse);

        // 这里可以对Click获取到的Graphics做额外处理，
        // 比如：过滤

        resolve(graphics);
      });
    });
  });
};
