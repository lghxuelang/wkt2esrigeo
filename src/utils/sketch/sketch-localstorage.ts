import _ from 'lodash';
import { ISketchStorage, SketchStorageData } from '@/utils/sketch/ISketchStorage';

const StorageKey = 'geomap-sketches';

export default class SketchLocalStorage implements ISketchStorage {
  load(): Promise<SketchStorageData[]> {
    return new Promise((resolve, reject) => {
      const storage = window.localStorage.getItem(StorageKey);
      if (storage && _.isArray(JSON.parse(storage))) {
        const jsonArr = JSON.parse(storage);
        const dataArr: SketchStorageData[] = <SketchStorageData[]>_.map(jsonArr, json => {
          return SketchStorageData.fromJSON(json);
        }).filter(Boolean);
        resolve(dataArr);
      } else {
        resolve([]);
      }
    });
  }

  save(data: SketchStorageData[]): Promise<void> {
    return new Promise(resolve => {
      window.localStorage.setItem(StorageKey, JSON.stringify(data));
      resolve();
    });
  }
}
