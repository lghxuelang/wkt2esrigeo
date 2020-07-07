import { Reducer } from 'redux';
export interface MaptoolbarModelState {
  activeToolbar: string;
}

export interface ToolbarModelTypes {
  namespace: 'maptoolbar';
  state: MaptoolbarModelState;
  effects: {};
  reducers: {
    updataActiveToolbar: Reducer<MaptoolbarModelState>;
  };
}

const MaptoolbarModel: ToolbarModelTypes = {
  namespace: 'maptoolbar',

  state: {
    activeToolbar: '', // 激活的工具状态
  },

  effects: { },

  reducers: {
    updataActiveToolbar(state = { activeToolbar: '' }, action): MaptoolbarModelState {
      return { ...state, activeToolbar: action.payload };
    },
  },
};

export default MaptoolbarModel;
