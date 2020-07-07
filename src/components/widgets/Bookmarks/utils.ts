import { viewUtils } from '@/utils/arcgis';

/**
 * 获取当前场景缩略图
 */
export async function takeScreenShot(opt: object = {}): Promise<string> {
  const view = await viewUtils.isViewReady();
  const { dataUrl } = await view.takeScreenshot(opt);
  return dataUrl;
}

/**
 * 由base64生成文件
 * @param dataUrl
 * @param filename
 */
export function dataURLtoFile(dataUrl: string, filename) {
  const arr: string[] = dataUrl.split(',');
  const mime: string = arr![0].match(/:(.*?);/)![1];
  const bstr: string = atob(arr[1]);
  let n:number = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export default {takeScreenShot, dataURLtoFile};
