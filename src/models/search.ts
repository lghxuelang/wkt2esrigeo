import { Reducer } from 'redux';
import { AppModelState } from '@/models/app';

export interface SearchModelState {

}

export interface SearchModelTypes {
  namespace: 'search';
  state: SearchModelState;
  effects: {
    // sampleEffectFunc: Effect;
  };
  reducers: {
    // updateViewLoaded: Reducer<AppModelState>;
  };
}

const SearchModel: SearchModelTypes = {
  namespace: 'search',

  state: {

  },

  effects: {},

  reducers: {}
};

export default SearchModel;

