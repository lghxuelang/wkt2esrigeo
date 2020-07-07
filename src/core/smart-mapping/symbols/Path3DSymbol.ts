import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';

export default class Path3DSymbol extends BaseGeoSymbol {
  width: number;
  height: number;
  anchor: 'center' | 'bottom' | 'top';
  cap: 'butt' | 'round' | 'square' | 'none';
  style: 'circle' | 'quad';
  color: string;
  outline: GeoLineSymbol;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.style = 'circle';
    this.width = 10;
    this.height = 10;

    this.anchor = 'center';
    this.cap = 'butt';

    this.color = GeoColors.NotAvailable;
    this.outline = new GeoLineSymbol(origin);
  }

  toEsriSymbolObject(): object {
    return {
      type: 'line-3d',
      symbolLayers: [
        {
          type: 'path',
          profile: this.style,
          width: this.width,
          height: this.height,
          material: {
            color: this.color,
          },
          cap: this.cap,
        },
      ],
    };
  }

  clone(): Path3DSymbol {
    const cloneObj = new Path3DSymbol(this.origin);
    cloneObj.style = this.style;
    cloneObj.width = this.width;
    cloneObj.height = this.height;
    cloneObj.color = this.color;
    return cloneObj;
  }
}
