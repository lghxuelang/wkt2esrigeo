import React from 'react';
import StgFeatureLayer from './strategies/feature';
import StgSceneLayer from './strategies/scene';
import SketchLayerEditor from './strategies/sketch';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { LayerTypes } from '@/core/layer/GeoLayerView';
import { isSketchLayer } from '@/utils/sketch/storage-factory';

const StrategyMap = {
  [LayerTypes.FeatureLayer]: StgFeatureLayer,
  [LayerTypes.SceneLayer]: StgSceneLayer,
};

export default {
  render(type: string, item: CatalogItem) {
    const StgEditor = StrategyMap[type];

    if (StgEditor) {
      return <StgEditor />;
    }

    if (type === LayerTypes.GraphicsLayer) {
      // 针对GraphicsLayer，存在一些不同的前端图层类别

      // 1. 如果图层是标绘图层
      if (isSketchLayer(item.layer)) {
        return <SketchLayerEditor />;
      }
    }

    return null;
  },
};
