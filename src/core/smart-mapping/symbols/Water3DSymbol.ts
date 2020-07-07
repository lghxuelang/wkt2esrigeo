import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';
import GeoLineSymbol from '@/core/smart-mapping/symbols/GeoLineSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';

export default class Water3DSymbol extends BaseGeoSymbol {
  color: string;
  waveDirection: number;
  waveStrength: string;
  waterbodySize: string;

  constructor(origin: GeoSymbolOrigin) {
    super(origin);

    this.waveDirection = 260;
    this.color = '#25427c';
    this.waveStrength = 'moderate';
    this.waterbodySize = 'medium';
  }

  toEsriSymbolObject(): object {
    return {
      type: 'water',
      waveDirection: this.waveDirection,
      color: this.color,
      waveStrength: this.waveStrength,
      waterbodySize: this.waterbodySize,
    };
  }
}
