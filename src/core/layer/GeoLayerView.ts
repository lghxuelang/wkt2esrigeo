export const LayerTypes = {
  BaseDynamicLayer: 'base-dynamic',
  BaseElevationLayer: 'base-elevation',
  BaseTileLayer: 'base-tile',
  BuildingSceneLayer: 'building-scene',
  CSVLayer: 'csv',
  ElevationLayer: 'elevation',
  FeatureLayer: 'feature',
  GeoJSONLayer: 'geojson',
  GeoRSSLayer: 'geo-rss',
  GraphicsLayer: 'graphics',
  GroupLayer: 'group',
  ImageryLayer: 'imagery',
  IntegratedMeshLayer: 'integrated-mesh',
  KMLLayer: 'kml',
  MapImageLayer: 'map-image',
  MapNotesLayer: 'map-notes',
  PointCloudLayer: 'point-cloud',
  SceneLayer: 'scene',
  TileLayer: 'tile',
  UnknownLayer: 'unknown',
  UnsupportedLayer: 'unsupported',
  VectorTileLayer: 'vector-tile',
  WMSLayer: 'wms',
  WMTSLayer: 'wmts',
  WebTileLayer: 'web-tile',
};

export interface GeoLayerViewConstructorOptions {
  view: __esri.LayerView;
  type: string;
  layerDataSourceId: string;
  geoMapViewId: string;
  geoLayerId: string;
}

export class GeoLayerView {
  id: string;

  view: __esri.LayerView;

  type: string;
  layerDataSourceId: string;
  geoMapViewId: string;
  geoLayerId: string;

  constructor(opt: GeoLayerViewConstructorOptions) {
    this.id = opt.geoMapViewId + '-' + opt.geoLayerId;
    this.view = opt.view;
    this.type = opt.type;
    this.layerDataSourceId = opt.layerDataSourceId;
    this.geoMapViewId = opt.geoMapViewId;
    this.geoLayerId = opt.geoLayerId;
  }

  selectRecordsByIds(id) {}

  destroy(): void {}
}
