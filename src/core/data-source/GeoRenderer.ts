export enum GeoRendererType {
  Simple,
  Water,
  SceneWhite,
  SceneMaterial,
  UniqueValue,
  ClassBreak,
  Sketch,
  Billboard,
  Unknown = 999,
}

export const GeoRendererTypeTextMap = {
  [GeoRendererType.Simple]: '仅位置(单一符号)',
  [GeoRendererType.Water]: '水面效果',
  [GeoRendererType.UniqueValue]: '类型(唯一符号)',
  [GeoRendererType.ClassBreak]: '计数和数量(颜色)',
  [GeoRendererType.SceneWhite]: '白模型',
  [GeoRendererType.SceneMaterial]: '精细模型',
  [GeoRendererType.Sketch]: '3D标绘',
  [GeoRendererType.Billboard]: '广告牌',
};
