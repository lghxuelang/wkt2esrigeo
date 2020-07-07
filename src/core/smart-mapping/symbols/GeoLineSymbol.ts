import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import { GeoColors } from '@/core/types/state';

export default class GeoLineSymbol extends BaseGeoSymbol {
  cap: string;
  color: string;
  join: string;
  miterLimit: number;
  style: string;
  width: number;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.color = GeoColors.NotAvailable;
    this.cap = 'round';
    this.join = 'round';
    this.miterLimit = 2;
    this.style = 'solid';
    this.width = 0.75;
  }

  toEsriSymbolObject(): object {
    return {
      type: 'simple-line',
      cap: this.cap,
      join: this.join,
      miterLimit: this.miterLimit,
      style: this.style,
      width: this.width,
      color: this.color === GeoColors.NotAvailable ? 'red' : this.color,
    };
  }

  clone(): GeoLineSymbol {
    const cloneObj = new GeoLineSymbol(this.origin);
    cloneObj.cap = this.cap;
    cloneObj.join = this.join;
    cloneObj.miterLimit = this.miterLimit;
    cloneObj.style = this.style;
    cloneObj.width = this.width;
    cloneObj.color = this.color;
    return cloneObj;
  }
}
