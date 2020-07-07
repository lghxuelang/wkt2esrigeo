import { IConfig } from '@umijs/types';

const config: IConfig = {
  exportStatic: {
    htmlSuffix: true,
    dynamicRoot: true,
  },
  antd: {},
  dva: {
    hmr: true,
  },
  lessLoader: {
    javascriptEnabled: true
  }
}

export default config;