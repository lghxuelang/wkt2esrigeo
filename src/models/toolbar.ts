import { Reducer } from 'redux';
import { AppModelState } from './app';
// import {  } from 'dva';
import layerCreator from '@/utils/arcgis/layer/layer-creator';

export interface ToolbarModelState {
  activeToolbar: string;
  layerClassify: Array<Object>;
}


export interface ToolbarModelTypes {
  namespace: 'toolbar';
  state: ToolbarModelState;
  effects: {};
  reducers: {
    updataActiveToolbar: Reducer<ToolbarModelState>;
    updateLayerClassify: Reducer<ToolbarModelState>;
  };
}

const ToolbarModel: ToolbarModelTypes = {
  namespace: 'toolbar',

  state: {
    activeToolbar: 'city', // 激活的工具状态
    layerClassify: [],
  },

  effects: {
    *queryLayerClassify({ payload }, { put, select }) {
      const featurePOI='https://103.233.7.3:8119/arcgis/rest/services/Hosted/POI/FeatureServer';
      const buildOpt = {
          type: 'Feature Service',
          title: 'POI_点数据',
          url: featurePOI,
        };
        const buildingLayer = yield layerCreator.create(buildOpt);
        // var populationChangeDefinition = {
        //   onStatisticField: "POP_2015 - POP_2010",
        //   outStatisticFieldName: "avg_pop_change_2015_2010",
        //   statisticType: "avg"
        // }
      
        let query = yield buildingLayer.createQuery();
        query.where = "1 = 1";
        query.outFields = ['*'];
        // query.outStatistics = [ populationChangeDefinition ];
        if(buildingLayer){
         let putdat =  yield buildingLayer.queryFeatures(query).then((response)=>{
               console.log(response);
              return response
            });
            yield put({ type: 'updateLayerClassify', payload: putdat.features });
        }
  },
  },

  reducers: {
    updataActiveToolbar(state = { activeToolbar: '', layerClassify:[] }, action): ToolbarModelState {
      return { ...state, activeToolbar: action.payload };
    },
    updateLayerClassify(state = { activeToolbar: '', layerClassify:[] }, action): ToolbarModelState {
      return { ...state, layerClassify: action.payload };
    },
  },
};

export default ToolbarModel;
