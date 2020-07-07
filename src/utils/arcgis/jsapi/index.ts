import esriLoader from 'esri-loader';

interface IESRILoaderConfig {
  dojoConfig?: Object;
  url?: string;
}

function load(modules: string[]): Promise<any> {
  const opt: IESRILoaderConfig = {};
  const win:Window = window;
  if (win.dojoConfig) {
    opt.dojoConfig = window.dojoConfig;
  }

  if (win.apiRoot) {
    opt.url = window.apiRoot;
  }

  if (!esriLoader.utils.Promise) {
    esriLoader.utils.Promise = window['Promise'];
  }

  return esriLoader.loadModules(modules, opt);
}

export default { load };
