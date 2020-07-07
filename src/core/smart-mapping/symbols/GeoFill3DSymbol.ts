/**
 * Wrap for ArcGIS JSAPI
 * Polygon3D
 */
import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';
import GeoEdge3DSymbol from '@/core/smart-mapping/symbols/GeoEdge3DSymbol';

export default class GeoFill3DSymbol extends BaseGeoSymbol {
  color: string;
  colorMixMode: string;
  outline: GeoLineSymbol;
  edge: GeoEdge3DSymbol;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.colorMixMode = 'multiply';
    this.outline = new GeoLineSymbol(origin);
    this.edge = new GeoEdge3DSymbol(origin);
  }

  toEsriSymbolObject(): object {
    return {
      type: 'polygon-3d',
      symbolLayers: [
        {
          type: 'fill',
          material: {
            color: this.color,
            colorMixMode: this.colorMixMode,
          },
          outline: {
            color: this.outline.color,
            size: this.outline.width,
          },
          edges: this.edge.toEsriSymbolObject(),
        },
      ],
    };
  }
}
