import BaseGeoRenderer from '@/core/smart-mapping/renderers/BaseGeoRenderer';
import GeoSimpleRenderer from '@/core/smart-mapping/renderers/GeoSimpleRenderer';
import GeoWaterRenderer from '@/core/smart-mapping/renderers/GeoWaterRenderer';
import { LayerTypes } from '@/core/layer/GeoLayerView';

export default {
  createFromServer(layer: any): undefined | BaseGeoRenderer {
    if (layer) {
      const { renderer, geometryType } = layer;
      switch (layer.type) {
        case LayerTypes.FeatureLayer: {
          if (renderer) {
            const { type } = renderer;
            switch (type) {
              case 'simple': {
                const { symbol } = renderer;
                switch (symbol.type) {
                  case 'simple-marker':
                  case 'simple-line':
                  case 'simple-fill': {
                    const sr = new GeoSimpleRenderer(layer);
                    sr.symbolType = '2d';
                    return sr;
                  }
                  case 'point-3d':
                  case 'line-3d': {
                    const sr = new GeoSimpleRenderer(layer);
                    sr.symbolType = '3d';
                    return sr;
                  }
                  case 'polygon-3d': {
                    const { symbolLayers } = symbol;
                    if (symbolLayers && symbolLayers.length > 0) {
                      const firstSymbol = symbolLayers.getItemAt(0);
                      if (firstSymbol.type === 'water') {
                        return new GeoWaterRenderer(layer);
                      } else {
                        const sr = new GeoSimpleRenderer(layer);
                        sr.symbolType = '3d';
                        return sr;
                      }
                    }
                  }
                  default:
                    return new GeoSimpleRenderer(layer);
                }
              }
              default:
                break;
            }
          }
        }
        case LayerTypes.GraphicsLayer: {
          break;
        }
        default:
          break;
      }
    }

    return undefined;
  },
};
