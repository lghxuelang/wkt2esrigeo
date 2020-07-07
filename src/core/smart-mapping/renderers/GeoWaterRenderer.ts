import BaseGeoRenderer from '@/core/smart-mapping/renderers/BaseGeoRenderer';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import Water3DSymbol from '@/core/smart-mapping/symbols/Water3DSymbol';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import EditableSymbolProxy from '@/core/data-source/EditableSymbolProxy';

export default class GeoWaterRenderer extends BaseGeoRenderer {
  symbol: EditableSymbolProxy;

  constructor(layer: any) {
    super(GeoRendererType.Water);

    this.layer = layer;
    this.symbol = new EditableSymbolProxy();
    this.symbol.useSymbol(new Water3DSymbol(GeoSymbolOrigin.Client));
    this.esriRenderProps = {
      type: 'simple',
    };
  }

  renderToLayer(symbol: object) {
    if (!this.layer) {
      return;
    }

    this.layer.renderer = {
      ...this.esriRenderProps,
      symbol: {
        type: 'polygon-3d',
        symbolLayers: [{ ...symbol }],
      },
    };
  }

  renderCurrentToLayer() {
    if (this.symbol && this.symbol.current) {
      this.renderToLayer(this.symbol.current.toEsriSymbolObject());
    }
  }
}
