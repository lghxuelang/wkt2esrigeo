import _ from 'lodash';
import BaseGeoSymbol from './BaseGeoSymbol';
import GeoMarkerSymbol from './GeoMarkerSymbol';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';
import { GeoSymbolOrigin } from '../../data-source/GeoSymbol';
import GeoFillSymbol from '@/core/smart-mapping/symbols/GeoFillSymbol';
import GeoExtrude3DSymbol from '@/core/smart-mapping/symbols/GeoExtrude3DSymbol';
import { LayerTypes } from '@/core/layer/GeoLayerView';

export function createFromServer(layer: any): BaseGeoSymbol | undefined {
  if (layer) {
    const { renderer, geometryType } = layer;
    const { type } = renderer;

    switch (type) {
      case 'simple': {
        const { symbol } = renderer;

        if (geometryType === 'point') {
          const geoSymbol = new GeoMarkerSymbol(GeoSymbolOrigin.Server);
          if (symbol) {
            geoSymbol.size = symbol.size;
            geoSymbol.color = symbol.color.toHex();
            geoSymbol.outline = new GeoLineSymbol(GeoSymbolOrigin.Server);
            if (symbol.outline) {
              geoSymbol.outline.cap = symbol.outline.cap;
              geoSymbol.outline.join = symbol.outline.join;
              geoSymbol.outline.miterLimit = symbol.outline.miterLimit;
              geoSymbol.outline.style = symbol.outline.style;
              if (symbol.outline.color) {
                geoSymbol.outline.color = symbol.outline.color.toHex();
              }
              if (_.isNumber(symbol.outline.width)) {
                geoSymbol.outline.width = symbol.outline.width;
              }
            }
          }
          return geoSymbol;
        } else if (geometryType === 'polyline') {
          const geoSymbol = new GeoLineSymbol(GeoSymbolOrigin.Server);
          if (symbol) {
            geoSymbol.cap = symbol.cap;
            geoSymbol.join = symbol.join;
            geoSymbol.miterLimit = symbol.miterLimit;
            geoSymbol.style = symbol.style;
            if (symbol.color) {
              geoSymbol.color = symbol.color.toHex();
            }
            if (_.isNumber(symbol.width)) {
              geoSymbol.width = symbol.width;
            }
          }
          return geoSymbol;
        } else if (geometryType === 'polygon') {
          const geoSymbol = new GeoFillSymbol(GeoSymbolOrigin.Server);
          if (symbol) {
            geoSymbol.style = symbol.style;
            if (symbol.color) geoSymbol.color = symbol.color.toHex();
            if (symbol.outline) {
              if (symbol.outline.color) {
                geoSymbol.outline.color = symbol.outline.color.toHex();
              }
              geoSymbol.outline.cap = symbol.outline.cap;
              geoSymbol.outline.join = symbol.outline.join;
              geoSymbol.outline.miterLimit = symbol.outline.miterLimit;
              geoSymbol.outline.style = symbol.outline.style;
              if (_.isNumber(symbol.outline.width)) {
                geoSymbol.outline.width = symbol.outline.width;
              }
            }
          }
          return geoSymbol;
        }
      }
      default:
        break;
    }
  }

  return undefined;
}

export function create3DFromServer(layer: any): BaseGeoSymbol | undefined {
  return undefined;
}

export function getDefaultSymbol(
  geometryType,
  symbolType,
): GeoMarkerSymbol | GeoLineSymbol | GeoFillSymbol | GeoExtrude3DSymbol | undefined {
  switch (geometryType) {
    case 'point': {
      return symbolType === '2d'
        ? new GeoMarkerSymbol(GeoSymbolOrigin.Client)
        : new GeoMarkerSymbol(GeoSymbolOrigin.Client);
    }
    case 'polyline': {
      return symbolType === '2d'
        ? new GeoLineSymbol(GeoSymbolOrigin.Client)
        : new GeoLineSymbol(GeoSymbolOrigin.Client);
    }
    case 'polygon': {
      return symbolType === '2d'
        ? new GeoFillSymbol(GeoSymbolOrigin.Client)
        : new GeoExtrude3DSymbol(GeoSymbolOrigin.Client);
    }
    default:
      break;
  }

  return undefined;
}

export function serverSymbolType(layer: any): '2d' | '3d' {
  const { renderer, type } = layer;
  switch (type) {
    case LayerTypes.FeatureLayer: {
      if (renderer) {
        const { type } = renderer;
        switch (type) {
          case 'simple': {
            const { symbol } = renderer;
            if (
              ['picture-marker', 'simple-marker', 'simple-line', 'simple-fill'].indexOf(symbol.type)
            ) {
              return '2d';
            } else {
              return '3d';
            }
          }
          default:
            break;
        }
      }
    }
    case LayerTypes.GraphicsLayer: {
      // 所有的GraphicsLayer都认为是3D图层
      break;
    }
    default:
      break;
  }

  return '3d';
}
