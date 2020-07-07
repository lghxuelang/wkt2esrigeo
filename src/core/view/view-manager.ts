import _ from 'lodash';
import { EventEmitter } from 'events';
import GeoMapViewGroup from '@/core/view/GeoMapViewGroup';
import GeoMapView, { GeoMapViewConstructorOptions } from '@/core/view/GeoMapView';

export default class GeoViewManager extends EventEmitter {
  geoMapViewGroups: Map<string, GeoMapViewGroup>;

  private static _instance?: GeoViewManager;

  constructor() {
    super();
    this.geoMapViewGroups = new Map<string, GeoMapViewGroup>();
  }

  public static instance(): GeoViewManager {
    if (!GeoViewManager._instance) {
      GeoViewManager._instance = new GeoViewManager();
      window._mapViewManager = GeoViewManager._instance;
    }
    return GeoViewManager._instance;
  }

  public getGeoMapViewById(id): GeoMapView | null {
    const groups = _.keys(this.geoMapViewGroups);
    if (groups.length === 0) return null;

    _.each(groups, g => {
      if (_.keys(this.geoMapViewGroups.get(g)?.geoMapViews).indexOf(id) > -1) {
        return this.geoMapViewGroups.get(g)?.geoMapViews.get(id);
      }
    });

    return null;
  }

  public getGeoMapViewGroup(id) {
    return this.geoMapViewGroups.get(id) || null;
  }

  public createGeoMapView(opt: GeoMapViewConstructorOptions) {
    const id = opt.mapWidgetId + '-' + opt.dataSourceId;
    if (this.getGeoMapViewById(id)) {
      return Promise.resolve(this.getGeoMapViewById(id));
    }

    const view = new GeoMapView(opt);
    this.addGeoMapView(view);
    return view.whenGeoMapViewLoaded();
  }

  public addGeoMapView(view: GeoMapView) {
    const group = this.geoMapViewGroups.get(view.mapWidgetId);
    if (group) {
      group.addGeoMapView(view);
    } else {
      const g = new GeoMapViewGroup();
      g.addGeoMapView(view);
      this.geoMapViewGroups.set(e.mapWidgetId, g);
    }

    // dispatch events
    this.emit('add', {
      id: view.id,
      mapWidgetId: view.mapWidgetId,
      dataSourceId: view.dataSourceId,
      status: view.status,
    });
  }

  public setGeoMapView(view: GeoMapView) {
    this.addGeoMapView(view);
  }

  public destroyGeoMapView(id) {
    const view = this.getGeoMapViewById(id);
    if (view) {
      view.destroy();
    }

    _.each(_.keys(this.geoMapViewGroups), k => {
      if (_.keys(this.geoMapViewGroups.get(k)?.geoMapViews).indexOf(id) > -1) {
        this.geoMapViewGroups.get(k)?.geoMapViews.delete(id);
        if (this.geoMapViewGroups.get(k)?.geoMapViews.size === 0) {
          this.geoMapViewGroups.delete(k);

          // dispatch events
          this.emit('remove', id);
        }
      }
    });
  }
}
