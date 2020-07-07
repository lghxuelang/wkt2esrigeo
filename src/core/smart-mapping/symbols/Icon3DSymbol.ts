import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';

export default class Icon3DSymbol extends BaseGeoSymbol {
  size: number;
  style: string;
  color: string;
  outline: GeoLineSymbol;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.style = 'circle';
    this.size = 12;

    this.color = GeoColors.NotAvailable;
    this.outline = new GeoLineSymbol(origin);
  }

  toEsriSymbolObject(): object {
    return {
      type: 'point-3d',
      symbolLayers: [
        {
          type: 'icon',
          size: `${this.size}px`,
          resource: { primitive: this.style },
          material: {
            color: this.color,
          },
          outline: {
            color: this.outline.color,
            size: `${this.outline.width}px`,
          },
        },
      ],
    };
  }

  clone(): Icon3DSymbol {
    const cloneObj = new Icon3DSymbol(this.origin);
    cloneObj.outline = this.outline.clone();
    cloneObj.style = this.style;
    cloneObj.color = this.color;
    cloneObj.size = this.size;
    return cloneObj;
  }
}
