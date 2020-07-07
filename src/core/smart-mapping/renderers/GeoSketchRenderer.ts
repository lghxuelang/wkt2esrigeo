import _ from 'lodash';
import BaseGeoRenderer from '@/core/smart-mapping/renderers/BaseGeoRenderer';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import EditableSymbolProxy from '@/core/data-source/EditableSymbolProxy';
import SketchPointSymbol from '@/core/smart-mapping/symbols/sketch/SketchPointSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import SketchExtrudeSymbol from '@/core/smart-mapping/symbols/sketch/SketchExtrudeSymbol';
import sketchUtils from '@/utils/sketch';
import SketchLineSymbol from '@/core/smart-mapping/symbols/sketch/SketchLineSymbol';

export default class GeoSketchRenderer extends BaseGeoRenderer {
  point: EditableSymbolProxy;
  polyline: EditableSymbolProxy;
  polygon: EditableSymbolProxy;

  constructor(layer: any) {
    super(GeoRendererType.Sketch);
    this.layer = layer;

    this.point = new EditableSymbolProxy();
    const pointSymbol = new SketchPointSymbol(GeoSymbolOrigin.Client);
    this.point.useSymbol(pointSymbol);

    this.polyline = new EditableSymbolProxy();
    const polylineSymbol = new SketchLineSymbol(GeoSymbolOrigin.Client);
    this.polyline.useSymbol(polylineSymbol);

    this.polygon = new EditableSymbolProxy();
    const polygonSymbol = new SketchExtrudeSymbol(GeoSymbolOrigin.Client);
    this.polygon.useSymbol(polygonSymbol);

    this.renderToLayer = this.renderToLayer.bind(this);
    this.point.on('change', this.renderToLayer);
    this.polyline.on('change', this.renderToLayer);
    this.polygon.on('change', this.renderToLayer);
  }

  renderToLayer(symbol: any) {
    switch (symbol.type) {
      case 'point-3d': {
        // 1. refresh layer graphics
        if (this.layer) {
          _.each(
            _.filter(this.layer.graphics.toArray(), g => g.geometry.type === 'point'),
            g => {
              g.symbol = symbol;
            },
          );
        }
        // 2. refresh sketch tool config
        if (sketchUtils.sketchVm) {
          sketchUtils.sketchVm.pointSymbol = symbol;
        }
        break;
      }
      case 'line-3d': {
        if (this.layer) {
          _.each(
            _.filter(this.layer.graphics.toArray(), g => g.geometry.type === 'polyline'),
            g => {
              g.symbol = symbol;
            },
          );
        }
        if (sketchUtils.sketchVm) {
          sketchUtils.sketchVm.polylineSymbol = symbol;
        }
        break;
      }
      case 'polygon-3d': {
        if (this.layer) {
          _.each(
            _.filter(this.layer.graphics.toArray(), g => g.geometry.type === 'polygon'),
            g => {
              g.symbol = symbol;
            },
          );
        }
        if (sketchUtils.sketchVm) {
          sketchUtils.sketchVm.polygonSymbol = symbol;
        }
        break;
      }
      default:
        break;
    }
  }

  dispose() {
    this.point.off('change', this.renderToLayer);
    this.polyline.off('change', this.renderToLayer);
    this.polygon.off('change', this.renderToLayer);
  }
}
