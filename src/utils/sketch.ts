import _ from 'lodash';
import { EventEmitter } from 'events';
import wkt from 'terraformer-wkt-parser';
import jsapi from '@/utils/arcgis/jsapi';
import CatalogItem, { CatalogItemStatus } from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { LayerTypes } from '@/core/layer/GeoLayerView';
import { ISketchStorage, SketchStorageData } from '@/utils/sketch/ISketchStorage';
import SketchLocalStorage from '@/utils/sketch/sketch-localstorage';
import {
  convertGraphics2StorageData,
  convertStorage2GraphicsAsync,
} from '@/utils/sketch/storage-factory';
import LayerRendererManager from '@/core/data-source/LayerRendererManager';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import GeoSketchRenderer from '@/core/smart-mapping/renderers/GeoSketchRenderer';

export const SKETCH_LAYER_ID = 'layer-id-sketch';
const blue = [82, 82, 122, 0.9];
const white = [255, 255, 255, 0.8];

export function geometryToWkt(geometry) {
  if (geometry) {
    switch (geometry.type) {
      case 'point':
        return wkt.convert({
          type: 'Point',
          coordinates: [geometry.longitude, geometry.latitude],
        });
      case 'polyline':
        return wkt.convert({
          type: 'MultiLineString',
          coordinates: geometry.paths,
        });
      case 'polygon':
        return wkt.convert({
          type: 'Polygon',
          coordinates: geometry.rings,
        });
      default:
        break;
    }
  }

  return '';
}

export interface Sketch3DUtilsConstructorProps {
  view?: __esri.SceneView | __esri.MapView;
}

class Sketch3DUtils extends EventEmitter {
  view?: __esri.SceneView | __esri.MapView;
  polygonType: 'extrude' | 'polygon';
  maxOid: number;
  sketchVmAttached: boolean;
  item?: CatalogItem;

  _data: SketchStorageData[];
  graphics: any[];

  storage: ISketchStorage;

  sketchVm?: any;

  constructor(params?: Sketch3DUtilsConstructorProps) {
    super();
    if (params) {
      if (params.view) {
        this.view = params.view;
      }
    }

    this.storage = new SketchLocalStorage();
    this._data = [];
    this.graphics = [];

    // default set to extrude
    this.polygonType = 'extrude';
    this.sketchVmAttached = false;

    this.maxOid = 1;

    this.onDrawComplete = this.onDrawComplete.bind(this);
    this.onUpdateComplete = this.onUpdateComplete.bind(this);
  }

  setData(data: SketchStorageData[]) {
    this._data = data;

    if (this._data && this._data.length > 0) {
      const maxObject = _.maxBy(this._data, d => d.oid);
      if (maxObject) {
        this.maxOid = maxObject.oid;
      }
    }

    const that = this;
    convertStorage2GraphicsAsync(this._data).then(arr => {
      that.graphics = arr;
      that.attachViewModel();
    });
  }

  /**
   * 是否整体启用编辑
   */
  async active() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      this.sketchVm.updateOnGraphicClick = true;
    }
  }

  /**
   * 整体关闭编辑功能，主要是没有打开编辑工具条时
   */
  deactive() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      if (this.sketchVm.state === 'active') {
        this.sketchVm.cancel();
      }

      this.sketchVm.updateOnGraphicClick = false;
    }
  }

  stopDraw() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      this.sketchVm.cancel();
    }
  }

  async attachViewModel() {
    if (!this.sketchVmAttached) {
      const [SketchViewModel] = await jsapi.load(['esri/widgets/Sketch/SketchViewModel']);
      if (!this.item) {
        this.item = new CatalogItem({
          title: '我的标绘',
          type: LayerTypes.GraphicsLayer,
          opts: {
            id: SKETCH_LAYER_ID,
            graphics: this.graphics,
          },
        });

        const that = this;
        this.item.on('status-change', data => {
          if (data && data.status === CatalogItemStatus.Loaded) {
            if (that.item && that.item.layer) {
              that.item.renderMgr = new LayerRendererManager(that.item.layer);
              that.item.renderMgr.setRenderer(
                GeoRendererType.Sketch,
                new GeoSketchRenderer(that.item.layer),
              );
              const sketchRenderer = <GeoSketchRenderer>that.item.renderMgr.renderer;
              const defaultPointSymbol =
                sketchRenderer.point.current && sketchRenderer.point.current.toEsriSymbolObject();
              const defaultLineSymbol =
                sketchRenderer.polyline.current &&
                sketchRenderer.polyline.current.toEsriSymbolObject();
              const defaultExtrudeSymbol =
                sketchRenderer.polygon.current &&
                sketchRenderer.polygon.current.toEsriSymbolObject();

              // 为存储的数据对象贴上Symbol
              _.each(that.graphics, gra => {
                switch (gra.attributes.geometryType) {
                  case 'point': {
                    gra.symbol = defaultPointSymbol;
                    break;
                  }
                  case 'polyline': {
                    gra.symbol = defaultLineSymbol;
                    break;
                  }
                  case 'polygon': {
                    gra.symbol = defaultExtrudeSymbol;
                    break;
                  }
                  case 'extrude': {
                    gra.symbol = defaultExtrudeSymbol;
                    break;
                  }
                  default:
                    break;
                }
              });

              const vm = new SketchViewModel({
                layer: that.item && that.item.layer,
                view: that.view,
                updateOnGraphicClick: true,
                pointSymbol: defaultPointSymbol,
                polygonSymbol: defaultExtrudeSymbol,
                polylineSymbol: defaultLineSymbol,
              });
              vm.on('create', that.onDrawComplete);
              vm.on('update', that.onUpdateComplete);
              that.sketchVm = vm;
            }
          }
        });
        this.item.addToMap(false);
        this.sketchVmAttached = true;
      }
    }
  }

  getNextOid() {
    this.maxOid += 1;

    return this.maxOid;
  }

  onUpdateComplete(event) {
    // get the graphic as it is being updated
    const graphic = event.graphics[0];

    // check if the update event's the toolEventInfo.type is move-stop or reshape-stop
    // then it means user finished moving or reshaping the graphic, call complete method.
    // this will change update event state to complete and we will check the validity of the graphic location.
    if (
      event.toolEventInfo &&
      (event.toolEventInfo.type === 'move-stop' || event.toolEventInfo.type === 'reshape-stop')
    ) {
      if (this.sketchVm) {
        this.sketchVm.complete();
      }
    } else if (event.state === 'cancel' || event.state === 'complete') {
      // graphic moving or reshaping has been completed or cancelled
      // if the graphic is in an illegal spot, call sketchviewmodel's update method again
      // giving user a chance to correct the location of the graphic
      const { geometry, attributes } = graphic;
      const oid = attributes.ObjectId;
      this.emit('edit', {
        state: 'update',
        geometry,
        oid,
      });
    }
  }

  onDrawComplete(evt) {
    if (evt.state === 'complete') {
      const { graphic } = evt;
      const { geometry } = graphic;
      const { type } = geometry;
      const detype =
        type === 'polygon' ? (this.polygonType === 'polygon' ? 'polygon' : 'extrude') : type;
      const oid = this.getNextOid();
      graphic.attributes = {
        ObjectId: oid,
        geometryType: detype,
      };
      this.emit('edit', {
        state: 'create',
        geometry,
        oid,
      });
    }
  }

  addPoint() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      this.sketchVm.create('point');
    }
  }

  addLine() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      this.sketchVm.create('polyline');
    }
  }

  addArea() {
    if (!this.view) {
      return;
    }

    if (this.sketchVm) {
      // set symbol to polygon
      // this.sketchVm.polygonSymbol = polygonSymbol;
      this.polygonType = 'polygon';
      this.sketchVm.create('polygon');
    }
  }

  addExtrude() {
    if (!this.view) {
      return;
    }

    // set symbol to extrude
    // this.sketchVm.polygonSymbol = extrudeSymbol;
    this.polygonType = 'extrude';
    this.sketchVm.create('polygon');
  }

  getLatestDataSet(): SketchStorageData[] {
    if (this.item && this.item.layer) {
      return convertGraphics2StorageData(this.item.layer.graphics.toArray());
    }

    return [];
  }

  convertOidToDataStruct4Add(oids) {
    if (_.isArray(oids)) {
      if (this.item && this.item.layer) {
        const that = this;
        return _.map(oids, id => {
          const graphic =
            that.item && that.item.layer.graphics.find(g => g.attributes.ObjectId === id);
          if (graphic) {
            return {
              decription: '',
              geometry: geometryToWkt(graphic.geometry),
              geometrytype: graphic.attributes.geometrytype,
              name: '',
              objectid: null,
            };
          }

          return null;
        }).filter(Boolean);
      }
    }

    return [];
  }

  convertOidToDataStruct4Update(oids) {
    if (_.isArray(oids)) {
      if (this.item && this.item.layer) {
        const that = this;
        return _.map(oids, id => {
          const graphic =
            that.item && that.item.layer.graphics.find(g => g.attributes.ObjectId === id);
          if (graphic) {
            return {
              decription: '',
              geometry: geometryToWkt(graphic.geometry),
              geometrytype: graphic.attributes.geometrytype,
              name: '',
              objectid: graphic.attributes.ObjectId,
            };
          }

          return null;
        }).filter(Boolean);
      }
    }

    return [];
  }
}

export default new Sketch3DUtils();
