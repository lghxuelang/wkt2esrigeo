import _ from 'lodash';
import GeoMapViewGroup from '@/core/view/GeoMapViewGroup';
import GeoMapView, { GeoMapViewConstructorOptions } from '@/core/view/GeoMapView';

export default class ViewManager {
  geoMapViewGroups: Map<string, GeoMapViewGroup>;

  private static _instance: ViewManager | null = null;

  static instance() {
    if (!ViewManager._instance) {
      ViewManager._instance = new ViewManager();
      window._mapViewManager = ViewManager._instance;
    }

    return ViewManager._instance;
  }

  constructor() {
    this.geoMapViewGroups = new Map<string, GeoMapViewGroup>();
  }

  getGeoMapViewById(id) {
    const keys = _.keys(this.geoMapViewGroups);
    if (keys.length === 0) return null;

    for (let r = 0; r < keys.length; r += 1) {
      const key = keys[r];
      if (_.keys(this.geoMapViewGroups.get(key)?.geoMapViews).indexOf(id) > -1) {
        return this.geoMapViewGroups.get(key)?.geoMapViews.get(id);
      }
    }
    return null;
  }

  getGeoMapViewGroup(id) {
    return this.geoMapViewGroups.get(id) || null;
  }

  createGeoMapView(opt: GeoMapViewConstructorOptions) {
    const id = opt.mapWidgetId + '-' + opt.dataSourceId;
    if (this.getGeoMapViewById(id)) {
      return Promise.resolve(this.getGeoMapViewById(id));
    }

    const view = new GeoMapView(opt);
    this.addGeoMapView(view);
    return view.whenGeoMapViewLoaded();
  }

  addGeoMapView(view: GeoMapView) {
    if (this.geoMapViewGroups.get(view.mapWidgetId)) {
      this.geoMapViewGroups.get(view.mapWidgetId)?.addGeoMapView(view);
    } else {
      const group = new GeoMapViewGroup();
      group.addGeoMapView(view);
      this.geoMapViewGroups.set(view.mapWidgetId, group);
    }
    // TODO: dispatch
    // i.getAppStore().dispatch(
    //   i.appActions.jimuMapViewAdded(
    //     e.id,
    //     i.Immutable({
    //       id: e.id,
    //       mapWidgetId: e.mapWidgetId,
    //       datasourceId: e.datasourceId,
    //       status: e.status,
    //     })
    //   )
    // );
  }

  destroyGeoMapView(id) {
    const view = this.getGeoMapViewById(id);
    if (view) {
      view.destroy();
    }

    const keys = _.keys(this.geoMapViewGroups);
    if (keys.length !== 0) {
      for (let a = 0; a < keys.length; a += 1) {
        const key = keys[a];
        if (_.keys(this.geoMapViewGroups.get(key)?.geoMapViews).indexOf(id) > -1) {
          this.geoMapViewGroups.get(key)?.geoMapViews.delete(id);
          if (0 === _.keys(this.geoMapViewGroups.get(key)?.geoMapViews).length) {
            this.geoMapViewGroups.delete(key);
          }
          // TODO:
          // i
          //   .getAppStore()
          //   .dispatch(i.appActions.jimuMapViewRemoved(e));
          break;
        }
      }
    }
  }
}
