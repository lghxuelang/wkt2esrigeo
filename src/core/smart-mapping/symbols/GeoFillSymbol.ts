import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';

export default class GeoFillSymbol extends BaseGeoSymbol {
  color: string;
  style: string;
  outline: GeoLineSymbol;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.style = 'solid';
    this.outline = new GeoLineSymbol(this.origin);
  }

  toEsriSymbolObject(): object {
    return {
      type: 'simple-fill',
      style: this.style,
      color: this.color === GeoColors.NotAvailable ? 'red' : this.color,
      outline: this.outline.toEsriSymbolObject(),
    };
  }

  clone(): GeoFillSymbol {
    const cloneObj = new GeoFillSymbol(this.origin);
    cloneObj.style = this.style;
    cloneObj.color = this.color;
    cloneObj.outline = this.outline.clone();
    return cloneObj;
  }
}
