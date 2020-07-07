import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';

export default class GeoMarkerSymbol extends BaseGeoSymbol {
  color: string;
  size: number;
  style: string;
  outline: GeoLineSymbol;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.style = 'circle';
    this.size = 10;
    this.outline = new GeoLineSymbol(origin);
  }

  toEsriSymbolObject(): object {
    return {
      type: 'simple-marker',
      size: this.size,
      style: this.style,
      color: this.color === GeoColors.NotAvailable ? 'red' : this.color,
      outline: this.outline.toEsriSymbolObject(),
    };
  }

  clone(): GeoMarkerSymbol {
    const cloneObj = new GeoMarkerSymbol(this.origin);
    cloneObj.style = this.style;
    cloneObj.size = this.size;
    cloneObj.color = this.color;
    cloneObj.outline = this.outline.clone();
    return cloneObj;
  }
}
