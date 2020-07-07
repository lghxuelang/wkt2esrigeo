export enum DataSourceTypes{
  Map = 'MAP',
  WebMap = 'WEB_MAP',
  WebScene = 'WEB_SCENE',

  FeatureLayer = 'FEATURE_LAYER'
}

export function fixLayerId(layerId: string): string{
  return layerId.replace(/\s/g, '_');
}
