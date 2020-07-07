import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';

export default class GeoEdge3DSymbol extends BaseGeoSymbol {
  type: 'solid' | 'sketch';
  color: string;
  width: number;
  extensionLength: number;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.width = 1;
    this.extensionLength = 0;
    this.type = 'solid';
  }

  toEsriSymbolObject(): object {
    return {
      type: this.type,
      size: this.width,
      color: this.color,
      extensionLength: this.extensionLength,
    };
  }
}
