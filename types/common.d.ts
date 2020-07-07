export interface Size {
  width: number;
  height: number;
}
export interface BoundingBox {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
}
export declare enum GeoFieldType {
  String = 'STRING',
  Number = 'Number',
  Date = 'DATE',
}
export declare enum AjaxState {
  Fetching = 'FETCHING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}
export interface AjaxResponse<T> {
  data?: T;
  err?: any;
}
export declare type EsriDateFormats =
  | 'shortDate'
  | 'shortDateLE'
  | 'longMonthDayYear'
  | 'dayShortMonthYear'
  | 'longDate'
  | 'shortDateShortTime'
  | 'shortDateLEShortTime'
  | 'shortDateShortTime24'
  | 'shortDateLEShortTime24'
  | 'shortDateLongTime'
  | 'shortDateLELongTime'
  | 'shortDateLongTime24'
  | 'shortDateLELongTime24'
  | 'longMonthYear'
  | 'shortMonthYear'
  | 'year';
export declare const ESRI_DATE_FORMAT_ARRAY: string[];
export interface EsriDateFormat {
  datePattern: string;
  timePattern?: string;
  selector: string;
}
export interface EsriDateFormatMap {
  [x: string]: EsriDateFormat;
}
export interface ServiceInfo {}
export declare enum UrlProtocol {
  Http = 'http:',
  Https = 'https:',
}
