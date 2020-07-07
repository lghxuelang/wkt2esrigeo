import _ from 'lodash';
import wkt from 'terraformer-wkt-parser';
import jsapi from '@/utils/arcgis/jsapi';
import { SketchStorageData } from '@/utils/sketch/ISketchStorage';

function geometryToWkt(geometry) {
  if (geometry) {
    switch (geometry.type) {
      case 'point':
        return wkt.convert({
          type: 'Point',
          coordinates: [geometry.longitude, geometry.latitude],
        });
      case 'polyline':
        return wkt.convert({
          type: 'MultiLineString',
          coordinates: geometry.paths,
        });
      case 'polygon':
        return wkt.convert({
          type: 'Polygon',
          coordinates: geometry.rings,
        });
      default:
        break;
    }
  }

  return '';
}

export function convertGraphics2StorageData(graphics: any[]): SketchStorageData[] {
  if (_.isArray(graphics) && graphics.length > 0) {
    return _.map(graphics, g => {
      const d = new SketchStorageData(g.attributes.ObjectId);
      d.geometryType = g.attributes.geometryType;
      d.wktGeometry = geometryToWkt(g.geometry);
      return d;
    });
  }

  return [];
}

export async function convertStorage2GraphicsAsync(storage: SketchStorageData[]): Promise<any[]> {
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  if (_.isArray(storage) && storage.length > 0) {
    return _.map(storage, s => {
      const primitive: any = wkt.parse(s.wktGeometry);
      if (primitive) {
        const geometry: any = {
          type: s.geometryType === 'extrude' ? 'polygon' : s.geometryType,
          spatialReference: { wkid: 102100, latestWkid: 4326 },
        };
        let symbol = null;
        switch (s.geometryType) {
          case 'point':
            geometry.longitude = primitive.coordinates[0];
            geometry.latitude = primitive.coordinates[1];
            break;
          case 'polyline':
            geometry.paths = primitive.coordinates;
            break;
          case 'polygon':
            geometry.rings = primitive.coordinates;
            break;
          case 'extrude':
            geometry.rings = primitive.coordinates;
            break;
          default:
            break;
        }

        return new Graphic({
          attributes: {
            ObjectId: s.oid,
            geometryType: s.geometryType,
          },
          geometry,
        });
      }

      return null;
    }).filter(Boolean);
  }

  return [];
}

export function isSketchLayer(layer: any) {
  return layer && layer.title === '我的标绘';
}
