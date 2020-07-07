import _ from 'lodash';
import GeoMapView from '@/core/view/GeoMapView';

export default class GeoMapViewGroup {
  geoMapViews: Map<string, GeoMapView>;

  constructor() {
    this.geoMapViews = new Map<string, GeoMapView>();
  }

  addGeoMapView(view: GeoMapView) {
    this.geoMapViews.set(view.id, view);
  }

  setGeoMapView(view: GeoMapView) {
    this.geoMapViews.set(view.id, view);
  }

  removeGeoMapView(view: GeoMapView) {
    this.geoMapViews.delete(view.id);
  }

  getActiveGeoMapView(): null | GeoMapView {
    _.each(_.keys(this.geoMapViews), k => {
      if (this.geoMapViews.get(k)?.isActive) {
        return this.geoMapViews.get(k);
      }
    });

    return null;
  }
}
