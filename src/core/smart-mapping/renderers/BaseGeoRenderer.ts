import { GeoRendererType, GeoRendererTypeTextMap } from '@/core/data-source/GeoRenderer';

export default class BaseGeoRenderer {
  type: GeoRendererType;
  layer: any;
  protected esriRenderProps: object;

  constructor(type: GeoRendererType) {
    this.type = type;
    this.esriRenderProps = {};
  }

  public get desc(): string {
    return GeoRendererTypeTextMap[this.type];
  }

  renderToLayer(symbol: object) {}
  renderCurrentToLayer() {}
  dispose() {}
}
