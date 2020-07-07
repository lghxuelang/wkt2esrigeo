import GeoExtrude3DSymbol from '@/core/smart-mapping/symbols/GeoExtrude3DSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';

export default class SketchExtrudeSymbol extends GeoExtrude3DSymbol {
  constructor(origin: GeoSymbolOrigin) {
    super(origin);
    this.size = 1000;
    this.color = '#ffffff';
    this.outlineEnabled = true;
    this.outline.width = 3;
    this.outline.color = '#52527a';
  }
}
