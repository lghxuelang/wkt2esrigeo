import { viewUtils } from '@/utils/arcgis';
/*
 * bim属性树节点点击控制图层的方法封装
 * author:wangxd
 */
let highlight;
//针对scenelayer的属性过滤查询
const BimlayerFind = (view, layer, ftnameArr) => {
  const params = ftnameArr.map((name) => `'${name}'`);
  // 控制除了查询到的bim组件显示，其他bim组件隐藏
  layer.definitionExpression = `featurename in (${params})`;
  setTimeout(() => {
    if (layer) {

      view.whenLayerView(layer).then(bimLyrView => {
        var query = layer.createQuery();
        query.where = `featurename in (${params})`;
        bimLyrView.queryFeatures(query).then(result => {
          if (highlight) {
            highlight.remove();
          }
          highlight = bimLyrView.highlight(result.features);
        });
        // // 如果只有一个构件名称返回则弹出popup 否则关闭popup
        if (params.length === 1) {
          bimLyrView.queryFeatures(query).then(fs => {
            const { features } = fs;
            features.map((fea) => {
              fea.attributes['mark'] = window.g_app._store.getState().bimmodel.currentBimVersion.bimId;
            });
            if (features && features.length) {
              view.popup.open({
                features,
              });
            }
          });
        } else {
          view.popup.close()
        }
        // 查询到的bim模型高亮跳转到对应bim构件位置，隐藏其他图层
        bimLyrView.queryExtent(query).then(result => {
          if (result.extent) {
            view.goTo(result.extent.expand(1.5));
          }
        });
      });
    }
  }, '2000')
}



// 适用对象：buildingSceneLayer,还原初始状态
const recoverBimInitial = (view, layerName) => {
  if (highlight) {
    highlight.remove();
  }
  view.popup.close();
  const lyr = viewUtils.getLayerByTitle(view, layerName);
  if (lyr) {
    lyr.definitionExpression = '';
  }
  viewUtils.zoomTolayer(view, lyr);
};


const bimUtils = {
  BimlayerFind,
  recoverBimInitial,
}

export default bimUtils