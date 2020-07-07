import _ from 'lodash';

export class SketchStorageData {
  oid: number;
  wktGeometry: string;
  geometryType: 'point' | 'polyline' | 'polygon' | 'extrude';
  name?: string;
  desc?: string;

  constructor(id) {
    this.oid = id;
    this.wktGeometry = '';
    this.geometryType = 'point';
  }

  static fromJSON(json: object): null | SketchStorageData {
    if (_.has(json, 'oid') && _.isInteger(parseInt(_.get(json, 'oid'), 10))) {
      const ret = new SketchStorageData(parseInt(_.get(json, 'oid')));
      ret.wktGeometry = _.get(json, 'wktGeometry') || '';
      ret.geometryType = _.get(json, 'geometryType') || 'point';
      ret.name = _.get(json, 'name');
      ret.desc = _.get(json, 'desc');

      return ret;
    }

    return null;
  }
}

export interface ISketchStorage {
  load: () => Promise<SketchStorageData[]>;
  save: (data: SketchStorageData[]) => Promise<void>;
}
