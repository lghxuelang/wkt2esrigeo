export interface EsriConfig {
  initialExtent: __esri.ExtentProperties;
  initialCamera: __esri.CameraProperties;
}

export interface ServiceConfig {
  host?: string;
  hostServer?: string;
  portal?: string;
  proxy?: string;

  webSceneId?: string;
  appId: string;
  useOauth: boolean;
}

export interface LayerConfig {
  title: string;
  url?: string;
  itemId?: string;
  type: string;
  opts?: object;
  children?: LayerConfig[];
}

export interface GeoConfig {
  jsapiConfig: EsriConfig;
  portalConfig: ServiceConfig;
}
