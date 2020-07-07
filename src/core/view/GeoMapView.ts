import _ from 'lodash';
import * as dsCommon from '@/core/data-source/common';
import { GeoLayerView, LayerTypes } from '@/core/layer/GeoLayerView';
import MessageManager from '@/core/message-manager';
import { JimuMapViewStatus } from '@/core/types/state';
import { fixLayerId } from '@/core/data-source/common';
import Layer = __esri.Layer;

export interface GeoMapViewConstructorOptions {
  mapWidgetId: string;
  isActive?: boolean;
  dataSourceId: string;

  view: __esri.MapView | __esri.SceneView;
  isEnablePopup?: boolean;
}

export default class GeoMapView {
  id: string;
  mapWidgetId: string;
  isActive?: boolean;
  dataSourceId: string;

  view: __esri.MapView | __esri.SceneView;
  status: string; // enum

  geoLayerViews: Map<string, object>;

  private geoLayerViewLoadPromises: Map<string, Promise<any>>;

  private isClickedNoPopUpFeature;
  private isEditing;
  private isEnablePopup;
  private isEnableHighlight;

  getGeoLayerViewId: (id: string, child: string) => string;

  constructor(opt: GeoMapViewConstructorOptions) {
    this.geoLayerViewLoadPromises = new Map<string, Promise<any>>();
    this.isClickedNoPopUpFeature = false;
    this.isEnableHighlight = true;
    this.getGeoLayerViewId = function(id, child) {
      const childId = DataSourceManager.instance()
        .getDataSource(id)
        .getGeoChildId(child)[0];
      return this.id + '-' + childId;
    };
    this.id = opt.mapWidgetId + '-' + opt.dataSourceId;
    this.mapWidgetId = opt.mapWidgetId;
    this.isActive = opt.isActive;
    this.dataSourceId = opt.dataSourceId;
    this.view = opt.view;
    this.geoLayerViews = new Map<string, object>();
    this.status = 'loading'; //  use enum
    this.isEnablePopup =
      void 0 === opt.isEnablePopup || null === opt.isEnablePopup || opt.isEnablePopup;
    this.isEditing = false;
    this.initView(this.view);
  }

  initView(view) {
    const that = this;
    if (view) {
      view.when(() => {
        view.on('click', that.onClick.bind(that));
      });

      view.popup.watch('visible', val => {
        if (
          that.isEnablePopup &&
          (val
            ? (that.isClickedNoPopUpFeature = false)
            : MessageManager.instance().publishMessage(
                new DataRecordsSelectionChangeMessage(that.mapWidgetId, []),
              ),
          !val && view.popup.selectedFeature && view.popup.selectedFeature.layer)
        ) {
          if (!view.popup.selectedFeature.layer.id) return;
          if (that.isClickedNoPopUpFeature) {
            return void (that.isClickedNoPopUpFeature = false);
          }
          that.clearAllGeoLayerViewsSelectRecord();
        }
      });

      view.popup.watch('selectedFeature', ft => {
        if (ft && ft.layer) {
          const oid = String(ft.attributes[ft.layer.objectIdField]);
          if (ft.layer.id) {
            const layerViewId = that.getGeoLayerViewId(
              that.dataSourceId,
              dsCommon.fixLayerId(ft.layer.id),
            );
            const layerView = that.geoLayerViews.get(layerViewId);
            if (layerView) {
              switch (layerView.type) {
                case LayerTypes.FeatureLayer: {
                  layerView.handleFeatureNavigationAtPopUp(oid);
                  layerView
                    .getLayerDataSource()
                    .doQueryById(oid)
                    .then(function(e) {
                      MessageManager.instance().publishMessage(
                        new DataRecordsSelectionChangeMessage(t.mapWidgetId, [e]),
                      );
                    });
                  break;
                }
                default:
                  break;
              }
            }
          }
        }
      });
    }
  }

  onClick(e: MouseEvent) {
    const that = this;
    const point = { x: e.x, y: e.y };
    this.view.hitTest(point).then(
      function(e) {
        if (
          that.isEnableHighlight &&
          ((e && e.results && e.result.length !== 0) ||
            (that.clearAllGeoLayerViewsSelectRecord(),
            MessageManager.instance().publishMessage(
              new DataRecordsSelectionChangeMessage(that.mapWidgetId, []),
            )),
          e.results.length)
        ) {
          const layerViews = that.geoLayerViews;
          const ids = _.keys(layerViews);
          e.results.forEach(r => {
            const { graphic } = r;
            if (graphic && graphic.layer) {
              const layerId = graphic.layer.id;
              if (!graphic.layer.popupEnabled) {
                that.isClickedNoPopUpFeature = true;
              }

              const layerViewId = that.getGeoLayerViewId(that.dataSourceId, layerId);
              const layerView = that.geoLayerViews.get(layerViewId);
              if (layerView) {
                switch (layerView.type) {
                  case LayerTypes.FeatureLayer: {
                    ids.splice(ids.indexOf(layerViewId), 1);
                    const oid = String(graphic.attributes[graphic.layer.objectIdField]);
                    layerView.selectRecordById(oid);
                    layerView
                      .getLayerDataSource()
                      .doQueryById(oid)
                      .then(response => {
                        MessageManager.instance().publishMessage(
                          new DataRecordsSelectionChangeMessage(that.mapWidgetId, [response]),
                        );
                      });
                  }
                }
              }
            }
          });
          if (ids) {
            _.each(ids, id => {
              const layerView = that.geoLayerViews.get(id);
              if (layerView) {
                switch (layerView.type) {
                  case LayerTypes.FeatureLayer: {
                    layerView.selectRecordsByIds([]);
                  }
                }
              }
            });
          }
        }
      },
      function() {
        that.clearAllGeoLayerViewsSelectRecord();
      },
    );
  }

  clearAllGeoLayerViewsSelectRecord() {
    for (var e = this.geoLayerViews, t = _.keys(e), r = 0; r < t.length; r++) {
      e[t[r]].selectRecordsByIds([]);
    }
  }

  createGeoLayerViews() {
    return this.whenAllGeoLayerViewsLoaded(this.view);
  }

  addGeoLayerView(layerView: GeoLayerView) {
    this.geoLayerViews.set(layerView.id, layerView);
  }

  whenGeoMapViewLoaded() {
    const that = this;

    return this.view
      ? this.view.when().then(
          function() {
            that.createGeoLayerViews();
            that.status = JimuMapViewStatus.Loaded;
            // MapViewManag
            return Promise.resolve(that);
          },
          function(err) {
            console.log(err);
            that.status = JimuMapViewStatus.Failed;
            // TODO: MapViewMana
            return Promise.reject(that);
          },
        )
      : ((this.status = JimuMapViewStatus.Failed),
        // MapViewMana
        Promise.reject(this));
  }

  whenAllGeoLayerViewsLoaded(view: __esri.MapView | __esri.SceneView) {
    const that = this;
    const r: Array<Promise<null | GeoLayerView>> = [];
    const o = this;
    return view.map.layers.toArray().map(function(u) {
      const ds = DataSourceManager.instance().getDataSource(that.dataSourceId);
      const child = ds.getJimuChildId(fixLayerId(u.id))[0];
      const childFull = ds.getFullChildDataSourceId(child);
      const layerView = view.whenLayerView(u).then(
        function(e) {
          let r = null;
          let o = null;
          switch (u.type) {
            case LayerTypes.FeatureLayer: {
              r = {
                geoLayerId: child,
                layerDataSourceId: childFull,
                view,
                geoMapViewId: that.id,
                type: u.type,
              };
              o = new JimuFeatureLayerView(r);
              that.addGeoLayerView(o);
              const ds = DataSourceManager.instance().getDataSource(o.layerDataSourceId);
              if (ds) {
                ds.addJimuFeatureLayerView(o);
                const p = ds.getCurrentQueryParams();
                o.setDefinitionExpressionForLayer(p);
              }
              break;
            }
            default: {
              r = {
                geoLayerId: child,
                layerDataSourceId: childFull,
                view,
                geoMapViewId: that.id,
                type: u.type,
              };
              o = new JimuLayerView(r);
              that.addGeoLayerView(o);
            }
          }
          return Promise.resolve(o);
        },
        function() {
          return Promise.reject(null);
        },
      );
      r.push(layerView);
      return Promise.all(r);
    });
  }

  getGeoLayerViewLoadPromiseById(id) {
    return this.geoLayerViewLoadPromises.get(id);
  }

  destroy() {
    for (var e = this.geoLayerViews, t = _.keys(e), r = 0; r < t.length; r++) {
      e[t[r]].destroy();
    }
    if (this.view && !this.view.destroyed) {
      this.view.graphics && this.view.graphics.destroyed && this.view.graphics.destroy();
      this.view.container = null;
      this.view.allLayerViews &&
        this.view.allLayerViews.destroyed &&
        this.view.allLayerViews.destroy();
      this.view.layerViews && this.view.layerViews.destroyed && this.view.layerViews.destroy();
      this.view.destroy();
      this.view = null;
    }
  }
}
