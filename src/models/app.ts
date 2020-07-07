import { Reducer } from 'redux';
// import { Subscription, Effect } from 'dva';

export interface AppModelState {
  viewLoaded: boolean;
}

export interface AppModelTypes {
  namespace: 'app';
  state: AppModelState;
  effects: {
    // sampleEffectFunc: Effect;
  };
  reducers: {
    updateViewLoaded: Reducer<AppModelState>;
  };
}

const AppModel: AppModelTypes  = {
  namespace: 'app',

  state: {
    viewLoaded: false,
  },

  effects: {},

  reducers: {
    updateViewLoaded(state = { viewLoaded: true }, { payload }): AppModelState {
      return { ...state, viewLoaded: payload };
    },
  },
};

export default AppModel;
