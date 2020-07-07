import { jsapi, geometryUtils, viewUtils } from '@/utils/arcgis';
import {color2TypeTable, restColor} from './styleCfg'

interface TqueryAllCfg {
  outFields: string[],
  returnGeometry: boolean,
  where: string,
}

const queryAllCfg = {
  outFields: ['*'],
  returnGeometry: true,
  where: '1=1',
};
/**
 * 获取数据
 * @param {string} url
 * @param {object} queryCfg
 */
export const queryData = async (url:string, queryCfg: Partial<TqueryAllCfg> = queryAllCfg) => {
  if (!url) {
    console.error('由于传入url');
    return;
  }
  const [QueryTask, Query] = await jsapi.load(['esri/tasks/QueryTask', 'esri/tasks/support/Query']);
  const queryTask = new QueryTask({
    url,
  });

  const query = new Query();
  Object.assign(query, queryCfg);

  // When resolved, returns features and graphics that satisfy the query.
  return queryTask.execute(query).then(function(results) {
    return results;
  });
}

/**
 * ugly color to type table
 */
// const color2TypeTable={
//   '基础': '#16CEB9',
//   '住宅': '#999BFF',
//   '民生': '#6648FF',
//   '产业': '#2D99FF',
//   '未分': '#D38143',
// }
// const restColor = ['#43D3D3','#16CE45','#D343A0','#D34343']
export const getColorByType = (typeArr:string[]):string[] => {
  let restIndex = -1
  return typeArr.map((type) => {
    const key = type.slice(0,2)
    if (color2TypeTable[key]) {
      return color2TypeTable[key]
    } else {
      restIndex += 1
      return restColor[restIndex]
    }
  })
}
