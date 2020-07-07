import _ from "lodash";
import { EventEmitter } from "events";
import { GeoSymbolOrigin } from "@/core/data-source/GeoSymbol";

export default class BaseGeoSymbol extends EventEmitter {
  origin: GeoSymbolOrigin;
  layer: any;

  constructor(origin: GeoSymbolOrigin) {
    super();
    this.origin = origin;
  }

  toEsriSymbolObject(): object {
    return {};
  }

  setProperty(property, value): boolean {
    if (_.has(this, property)) {
      _.set(this, property, value);
      return true;
    }

    return false;
  }

  clone(): BaseGeoSymbol {
    return new BaseGeoSymbol(GeoSymbolOrigin.Server);
  }
}
