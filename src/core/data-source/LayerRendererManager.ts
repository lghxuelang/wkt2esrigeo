import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import BaseGeoRenderer from '@/core/smart-mapping/renderers/BaseGeoRenderer';
import renderFactory from '@/core/smart-mapping/renderers/renderer-factory';

export default class LayerRendererManager {
  currentType: GeoRendererType;
  layer: any;
  renderer?: BaseGeoRenderer;

  /**
   * 由Map来缓存已经初始化的Render类型，以便于切换时恢复编辑的效果
   */
  private renderTypeMap: Map<GeoRendererType, BaseGeoRenderer>;

  constructor(layer: any) {
    this.currentType = GeoRendererType.Unknown;
    this.layer = layer;

    this.renderTypeMap = new Map<GeoRendererType, BaseGeoRenderer>();
  }

  static readFromLayer(layer: any): LayerRendererManager | null {
    if (layer) {
      const ins = new LayerRendererManager(layer);

      ins.renderer = renderFactory.createFromServer(layer);
      if (ins.renderer) {
        ins.currentType = ins.renderer.type;
        ins.renderTypeMap.set(ins.currentType, ins.renderer);
      }

      return ins;
    }

    return null;
  }

  setRenderer(type: GeoRendererType, renderer: BaseGeoRenderer) {
    this.renderTypeMap.set(type, renderer);
    this.switchRenderer(type);
  }

  switchRenderer(type: GeoRendererType) {
    this.currentType = type;
    this.renderer = this.renderTypeMap.get(type);
  }

  hasRendererCache(type: GeoRendererType) {
    return this.renderTypeMap.has(type);
  }

  renderToLayer() {
    if (this.renderer) {
      this.renderer.renderCurrentToLayer();
    }
  }

  dispose() {
    if (this.renderTypeMap.size > 0) {
      this.renderTypeMap.forEach(renderer => {
        renderer.dispose();
      });
      this.renderTypeMap.clear();
    }

    delete this.renderer;
    this.layer = null;
  }
}
