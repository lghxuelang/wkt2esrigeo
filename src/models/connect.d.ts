import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import { match, RouteComponentProps as BasicRouterProps } from 'react-router-dom';
import { AppModelState } from './app';
import { ToolbarModelState } from './toolbar';
import { MaptoolbarModelState } from './maptoolbar';
import { SearchModelState } from './search';
import { LayersModelState } from '@/models/layers';
import { SketchModelState } from '@/models/sketch';
import { TOCModelState } from '@/models/toc';

export interface RouteTypes<P, K> extends Omit<BasicRouterProps, 'location'> {
  computedMatch?: match<P>;
  route?: Route;
  location: BasicRouterProps['location'] | { pathname?: string };
}

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {};
}

export interface ConnectState {
  loading: Loading;
  app: AppModelState;
  toolbar: ToolbarModelState;
  maptoolbar: MaptoolbarModelState;
  layers: LayersModelState;
  sketch: SketchModelState;
  toc: TOCModelState;
}

export interface MenuDataItem {
  authority?: string[] | string;
  children?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: React.ReactNode;
  locale?: string;
  name?: string;
  key?: string;
  path?: string;
  [key: string]: any;
  parentKeys?: string[];
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

export interface ConnectProps<T = {}> extends Partial<RouteTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
