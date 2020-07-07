import jsapi from '../jsapi';
/**
 * 初始化二维场景
 * @author  lee  
 * @param {object} opt  设置参数对象
 * @returns undefined
 */
async function setEsriConfig(opt) {
  const [esriConfig] = await jsapi.load(['esri/config']);
  esriConfig.request.proxyUrl = opt.proxyUrl;
  if (opt.portal) {
    esriConfig.portalUrl = opt.portal;
  }
}


export default {
  setEsriConfig,
}