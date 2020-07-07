import { Reducer } from 'redux';
import { Effect } from '@@/plugin-dva/connect';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';

export interface LayersModelState {
  loadedKeys?: string[];
  currentSymbolEditItem?: CatalogItem | null;
}

export interface LayersModelTypes {
  namespace: 'layers';
  state: LayersModelState;
  effects: {
    startEditSymbol: Effect;
    completeEditSymbol: Effect;
    cancelEditSymbol: Effect;
  };
  reducers: {
    updateCurrentSymbolEditItem: Reducer<LayersModelState>;
    updateLoadedKeys: Reducer<LayersModelState>;
  };
}

const LayersModel: LayersModelTypes = {
  namespace: 'layers',

  state: {
    loadedKeys: [],

    currentSymbolEditItem: null,
  },

  effects: {
    *startEditSymbol({ payload }, { put }) {
      yield put({ type: 'updateCurrentSymbolEditItem', payload });
      yield put({ type: 'toc/showContent', payload: 'smart-mapping' });
    },
    *completeEditSymbol(action, { put }) {
      yield put({ type: 'updateCurrentSymbolEditItem', payload: null });
      yield put({ type: 'toc/showContent', payload: '' });
    },
    *cancelEditSymbol(action, { put }) {
      yield put({ type: 'updateCurrentSymbolEditItem', payload: null });
      yield put({ type: 'toc/showContent', payload: '' });
    },
  },

  reducers: {
    updateCurrentSymbolEditItem(state, action): LayersModelState {
      return { ...state, currentSymbolEditItem: action.payload };
    },
    updateLoadedKeys(state, action): LayersModelState {
      return { ...state, loadedKeys: action.payload };
    },
  },
};

export default LayersModel;
