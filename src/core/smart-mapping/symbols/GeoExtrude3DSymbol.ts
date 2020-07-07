import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import GeoEdge3DSymbol from '@/core/smart-mapping/symbols/GeoEdge3DSymbol';
import { GeoColors } from '@/core/types/state';

export default class GeoExtrude3DSymbol extends BaseGeoSymbol {
  color: string;
  size: number;
  outline: GeoEdge3DSymbol;
  outlineEnabled: boolean;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.size = 10000; // TODO: 先写死一个值,等待后期开发属性编辑器
    this.outline = new GeoEdge3DSymbol(origin);
    this.outlineEnabled = false;
  }

  toEsriSymbolObject(): object {
    return {
      type: 'polygon-3d',
      symbolLayers: [
        {
          type: 'extrude',
          size: this.size,
          material: {
            color: this.color,
          },
          edges: this.outlineEnabled ? this.outline.toEsriSymbolObject() : null,
        },
      ],
    };
  }
}
