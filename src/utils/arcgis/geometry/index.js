import jsapi from '../jsapi';
/**
 * 初始化底图
 * @author  lee  
 * @param {object} json  将json转为extent对象
 * @returns {object}  basemap 底图
 */
async function jsonToExtent(json) {
    const [Extent] = await jsapi.load(['esri/geometry/Extent']);
    const extent = Extent.fromJSON(json);
    return extent;
}
const intersect = async (geometry, intersector) => {
    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    const results = geometryEngine(geometry, intersector);
    return results;
}
/**
 * 根据点画缓冲区
 * @author liugh 
 * @param {*} point 点对象
 * @param {*} radius 缓冲范围 默认 5
 * @param {*} radiusUnit 缓冲单位 默认 米
 * @return {object} pointBuffer 缓冲对象
 */
async function drawBuffer(point, wishRadius = 5, wishRadiusUnit) {
    if (!point) return null;
    const radiusUnit = wishRadiusUnit || 'meters';
    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    const pointBuffer = geometryEngine.pointBuffer(point, wishRadius, radiusUnit);
    pointBuffer.symbol = {
      type: 'simple-fill',
      color: [140, 140, 222, 0.5],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2,
      },
    };
    return pointBuffer;
  }

const geometryUtils = {
    jsonToExtent,
    intersect,
    drawBuffer

};

export default geometryUtils;
