import { LayerTypes } from '@/core/layer/GeoLayerView';
import jsapi from '../jsapi';

export default {
  async create(opt) {
    if (opt.type === LayerTypes.GraphicsLayer) {
      const [GraphicsLayer] = await jsapi.load(['esri/layers/GraphicsLayer']);
      return new GraphicsLayer({
        title: opt.title,
        ...opt.params,
      });
    } else if (opt.type === 'WebTileLayer') {
      // 网络切片图层：天地图、谷歌等wmts图层
      console.log(opt.url);
      const [WebTileLayer] = await jsapi.load(['esri/layers/WebTileLayer']);
      return new WebTileLayer({
        urlTemplate: opt.url,
      });
    } else if (opt.type === 'TileLayer') {
      //arcgis切片图层：捷泰午夜蓝版
      const [TileLayer] = await jsapi.load(['esri/layers/TileLayer']);
      return new TileLayer({
        url: opt.url,
      });
    } else if (opt.type === 'mesh') {
      //倾斜摄影类型
      const [IntegratedMeshLayer] = await jsapi.load(['esri/layers/IntegratedMeshLayer']);

      return new IntegratedMeshLayer({
        title: opt.title,
        url: opt.url,
        ...opt.params,
      });
    } else if (opt.type === 'pointcloud') {
      const [PointCloudLayer] = await jsapi.load(['esri/layers/PointCloudLayer']);
      return new PointCloudLayer({
        url: opt.url,
        title: opt.title,
        ...opt.params,
      });
    } else if (opt.type === 'scene' || opt.type === 'SceneLayer') {
      const [SceneLayer] = await jsapi.load(['esri/layers/SceneLayer']);
      return new SceneLayer({
        url: opt.url,
        title: opt.title,
      });
    } else if (opt.type === 'building') {
      const [BuildingSceneLayer] = await jsapi.load(['esri/layers/BuildingSceneLayer']);

      return new BuildingSceneLayer({
        url: opt.url,
        title: opt.title,
      });
    } else if (opt.type === 'Feature Service' || opt.type === 'feature') {
      const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);

      return new FeatureLayer({
        url: opt.url,
        title: opt.title,
      });
    } else if (opt.type === 'Map Service') {
      const [MapImageLayer] = await jsapi.load(['esri/layers/MapImageLayer']);

      return new MapImageLayer({
        url: opt.url,
        title: opt.title,
      });
    } else if (opt.type === 'image' || opt.type === 'Image Service') {
      const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);

      return new ImageryLayer({
        url: opt.url,
        title: opt.title,
      });
    } else if (opt.type === 'dem') {
      const [ElevationLayer] = await jsapi.load(['esri/layers/ElevationLayer']);

      return new ElevationLayer({
        url: opt.url,
        ...opt.params,
      });
    } else if (opt.type === 'tile') {
      const [TileLayer] = await jsapi.load(['esri/layers/TileLayer']);
      return new TileLayer({
        url: opt.url,
        ...opt.params,
      });
    } else if (opt.type === 'dynamic') {
      const [MapImageLayer] = await jsapi.load(['esri/layers/MapImageLayer']);

      return new MapImageLayer({
        url: opt.url,
        ...opt.params,
      });
    } else if (opt.type === 'VectorTileLayer') {
      const [VectorTileLayer] = await jsapi.load(['esri/layers/VectorTileLayer']);
      return new VectorTileLayer({
        id: opt.title,
        url: opt.url,
      });
    }
  },

  async group(opt) {
    const [GroupLayer] = await jsapi.load(['esri/layers/GroupLayer']);
    return new GroupLayer({
      title: opt.title,
    });
  },
};
