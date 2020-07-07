declare global {
  interface EChartsTheme {
    color1: string[];
  }

  interface GeomapGlobal {
    view: any;
  }
  interface Window {
    dojoConfig?: Object;
    apiRoot: string;
    echarts_themes?: EChartsTheme;
    agsGlobal?: GeomapGlobal;
    // _mapViewManager?: any;
  }
}
export {};
