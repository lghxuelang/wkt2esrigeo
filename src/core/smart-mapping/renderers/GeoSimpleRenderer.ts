import BaseGeoRenderer from '@/core/smart-mapping/renderers/BaseGeoRenderer';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import EditableSymbolProxy from '@/core/data-source/EditableSymbolProxy';
import * as symbolFactory from '@/core/smart-mapping/symbols/symbol-factory';
import { GeoSymbolOrigin } from '@/core/data-source/GeoSymbol';
import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';

/**
 * 针对要素图层的简单渲染
 */
export default class GeoSimpleRenderer extends BaseGeoRenderer {
  symbolType: '2d' | '3d';

  symbol?: EditableSymbolProxy;
  symbol3D?: EditableSymbolProxy;

  constructor(layer: any) {
    super(GeoRendererType.Simple);

    this.layer = layer;
    this.symbol = new EditableSymbolProxy();
    this.symbol3D = new EditableSymbolProxy();

    this.symbolType = symbolFactory.serverSymbolType(this.layer);
    if (this.symbolType === '2d') {
      this.symbol.server = symbolFactory.createFromServer(this.layer);
      if (this.symbol.server) {
        this.symbol.current = this.symbol.server.clone();
        this.symbol.current.origin = GeoSymbolOrigin.Client;
      }
    } else {
      this.symbol3D.server = symbolFactory.create3DFromServer(this.layer);
      if (this.symbol3D.server) {
        this.symbol3D.current = this.symbol3D.server.clone();
        this.symbol3D.current.origin = GeoSymbolOrigin.Client;
      }
    }
    this.esriRenderProps = {
      type: 'simple',
    };

    this.renderToLayer = this.renderToLayer.bind(this);
    this.symbol.on('change', this.renderToLayer);
    this.symbol3D.on('change', this.renderToLayer);
  }

  renderToLayer(symbol) {
    if (!this.layer) {
      return;
    }

    this.layer.renderer = {
      ...this.esriRenderProps,
      symbol,
    };
  }

  renderCurrentToLayer() {
    if (this.symbolType === '2d' && this.symbol && this.symbol.current) {
      this.renderToLayer(this.symbol.current.toEsriSymbolObject());
    } else if (this.symbolType === '3d' && this.symbol3D && this.symbol3D.current) {
      this.renderToLayer(this.symbol3D.current.toEsriSymbolObject());
    }
  }

  useSymbolType(type: '2d' | '3d') {
    this.symbolType = type;
  }

  useServerSymbol() {
    if (this.symbol && this.symbol.server) {
      this.symbolType = '2d';
      this.symbol.useServerSymbol();
    } else if (this.symbol3D && this.symbol3D.server) {
      this.symbolType = '3d';
      this.symbol3D.useServerSymbol();
    }
  }

  lastSymbolOrDefault(): BaseGeoSymbol | undefined {
    if (this.symbolType === '2d' && this.symbol) {
      const existSymbol = this.symbol.current || this.symbol.previous || this.symbol.server;
      if (existSymbol) return existSymbol;

      this.symbol.current = symbolFactory.getDefaultSymbol(this.layer.geometryType, '2d');
      return this.symbol.current;
    } else if (this.symbolType === '3d' && this.symbol3D) {
      const existSymbol = this.symbol3D.current || this.symbol3D.previous || this.symbol3D.server;
      if (existSymbol) return existSymbol;

      this.symbol3D.current = symbolFactory.getDefaultSymbol(this.layer.geometryType, '3d');
      return this.symbol3D.current;
    }
  }

  setPropValue(prop, value) {
    if (this.symbolType === '2d') {
      this.symbol && this.symbol.setSymbolPropValue(prop, value);
    } else {
      this.symbol3D && this.symbol3D.setSymbolPropValue(prop, value);
    }
  }
}
