import { Reducer } from 'redux';
import { Effect } from 'dva';

export interface TOCModelState {
  content: string;
}

export interface TOCModelTypes {
  namespace: 'toc';
  state: TOCModelState;
  effects: {
    showContent: Effect;
  };
  reducers: {
    updateContent: Reducer<TOCModelState>;
  };
}

const TOCModel: TOCModelTypes = {
  namespace: 'toc',

  state: {
    content: '',
  },

  effects: {
    *showContent({ payload }, { put }) {
      // TODO: clear prev content
      yield put({ type: 'updateContent', payload });
    },
  },

  reducers: {
    updateContent(state, action): TOCModelState {
      return { ...state, content: action.payload };
    },
  },
};

export default TOCModel;
