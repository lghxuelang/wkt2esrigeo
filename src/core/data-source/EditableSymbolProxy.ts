import { EventEmitter } from 'events';
import BaseGeoSymbol from '@/core/smart-mapping/symbols/BaseGeoSymbol';

export default class EditableSymbolProxy extends EventEmitter {
  isDirty: boolean;
  editable: boolean;

  server?: BaseGeoSymbol;
  previous?: BaseGeoSymbol;
  current?: BaseGeoSymbol;

  constructor() {
    super();
    this.isDirty = false;
    this.editable = true;
  }

  useServerSymbol() {
    this.isDirty = false;

    if (this.previous) {
      this.current = this.previous.clone();
    }
    if (this.server) {
      this.notifyChange(this.server.toEsriSymbolObject());
    }
  }

  usePreviousClientSymbol() {
    this.isDirty = false;

    if (this.previous) {
      // 这里必须clone，是为了避免还原之后再次编辑污染上一次的对象
      this.current = this.previous.clone();
      this.notifyChange(this.previous.toEsriSymbolObject());
    }
  }

  useLatestClientSymbol() {
    if (this.current) this.notifyChange(this.current.toEsriSymbolObject());
  }

  getExistedSymbol(): BaseGeoSymbol | undefined {
    const existSymbol = this.current || this.previous || this.server;
    return existSymbol || undefined;

    // this.current = symbolFactory.getDefaultSymbol(this.layer.geometryType, '2d');
  }

  useSymbol(symbol: BaseGeoSymbol) {
    this.isDirty = false;

    this.current = symbol;
  }

  setSymbolPropValue(prop, value) {
    if (this.current && this.current.setProperty(prop, value)) {
      this.isDirty = true;

      this.notifyChange(this.current.toEsriSymbolObject());
    }
  }

  applyChange() {
    if (this.isDirty) {
      if (this.current) {
        this.previous = this.current.clone();

        // 不需要置空，便于保存之后继续接着编辑
        // this.current = undefined;
      }

      this.isDirty = false;
    }
  }

  notifyChange(data) {
    this.emit('change', data);
  }

  dispose() {}
}
