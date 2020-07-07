import _ from 'lodash';
import { EventEmitter } from 'events';
import { LayerConfig } from '../../../../../types/app';
import layerCreator from '@/utils/arcgis/layer/layer-creator';
import LayerRendererManager from '@/core/data-source/LayerRendererManager';

export enum CatalogItemStatus {
  NotLoad,
  Loading,
  Loaded,
  Failure,
}

export default class CatalogItem extends EventEmitter {
  id: string;
  status: CatalogItemStatus;
  layerCreated: boolean;
  children?: CatalogItem[];
  layer?: any;
  layerLoadPromise?: Promise<void>;
  renderMgr?: LayerRendererManager;
  private readonly _data: LayerConfig;

  constructor(data: LayerConfig) {
    super();
    this.id = Math.uuid();
    this.status = CatalogItemStatus.NotLoad;

    this._data = data;
    this.layerCreated = false;

    if (this.hasChild()) {
      this.children = _.map(this._data.children, c => new CatalogItem(c));
    }

    this.updateSymbol = this.updateSymbol.bind(this);
  }

  getTitle(): string {
    return (this._data && this._data.title) || '';
  }

  hasChild(): boolean {
    return (
      (this._data &&
        this._data.children &&
        _.isArray(this._data.children) &&
        this._data.children.length > 0) ||
      false
    );
  }

  count() {
    return _.sumBy(this.children, c => c.count()) + 1;
  }

  buildLayerOpts(): any {
    const ret: any = {
      title: this.getTitle(),
      type: this._data.type,
    };

    if (this._data.itemId) {
      ret.itemId = this._data.itemId;
    } else if (this._data.url) {
      ret.url = this._data.url;
    }

    if (_.has(this._data, 'opts')) {
      ret.params = {};
      _.each(_.keys(this._data.opts), k => {
        ret.params[k] = _.get(this._data.opts, k);
      });
    }

    return ret;
  }

  updateSymbol(symbol) {
    if (this.renderMgr && this.renderMgr.renderer) {
      this.renderMgr.renderer.renderToLayer(symbol);
    }
  }

  updateStatus(status: CatalogItemStatus) {
    const prev = this.status;
    this.status = status;
    this.emit('status-change', {
      id: this.id,
      target: this.id,
      prev,
      status,
    });
  }

  async addToMap(zoomTo: boolean = true) {
    this.updateStatus(CatalogItemStatus.Loading);

    const layerOpts = this.buildLayerOpts();
    const layer = await layerCreator.create(layerOpts);

    let nextStatus = CatalogItemStatus.Loaded;
    if (layer) {
      this.layer = layer;
      if (window.agsGlobal && window.agsGlobal.view) {
        window.agsGlobal.view.map.add(layer);
        try {
          await layer.when();

          const initRenderMgr = LayerRendererManager.readFromLayer(layer);
          if (initRenderMgr) {
            this.renderMgr = initRenderMgr;
          }

          if (zoomTo) {
            await window.agsGlobal.view.goTo(layer.fullExtent.expand(1.2));
          }
        } catch (e) {
          nextStatus = CatalogItemStatus.Failure;
        }
      }
    } else {
      nextStatus = CatalogItemStatus.Failure;
    }

    const minTime = () => new Promise(r => setTimeout(r, 1000));
    await minTime();
    this.updateStatus(nextStatus);
  }

  removeFromMap() {
    this.status = CatalogItemStatus.NotLoad;

    if (this.layer) {
      if (window.agsGlobal && window.agsGlobal.view) {
        window.agsGlobal.view.map.remove(this.layer);
      }
    }
    this.layer = undefined;

    if (this.renderMgr) {
      this.renderMgr.dispose();
      this.renderMgr = undefined;
    }
    this.updateStatus(this.status);
  }

  gotoFullExtent() {
    if (this.layer) {
      const that = this;
      this.layer.when(() => {
        window.agsGlobal.view.goTo(that.layer.fullExtent);
      });
    }
  }
}
