import Icon3DSymbol from '@/core/smart-mapping/symbols/Icon3DSymbol';
import Path3DSymbol from '@/core/smart-mapping/symbols/Path3DSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';

export default class SketchPolylineSymbol extends Path3DSymbol {
  constructor(origin: GeoSymbolOrigin) {
    super(origin);
    this.color = '#ffffff';
  }
}
