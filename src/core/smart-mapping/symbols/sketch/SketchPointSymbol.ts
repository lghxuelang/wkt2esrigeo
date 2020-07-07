import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import Icon3DSymbol from '@/core/smart-mapping/symbols/Icon3DSymbol';

export default class SketchPointSymbol extends Icon3DSymbol {
  constructor(origin: GeoSymbolOrigin) {
    super(origin);
    this.style = 'kite';
    this.size = 20;
    this.color = '#ffffff';
    this.outline.width = 3;
    this.outline.color = '#52527a';
  }
}
