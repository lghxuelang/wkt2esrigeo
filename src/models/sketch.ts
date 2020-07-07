import { Reducer } from 'redux';
import { notification } from 'antd';
import { Effect } from 'dva';
import sketchHelper from '@/utils/sketch';
import { SKETCH_LOAD } from '@/constants/action-types';

export interface SketchModelState {
  drawMode?: string;
  isActive?: boolean;
  isDirty?: boolean;
  addedOids?: number[];
  updatedOids?: number[];
  deletedOids?: number[];
}

export interface SketchModelType {
  namespace: 'sketch';
  state: SketchModelState;
  effects: {
    load: Effect;
    active: Effect;
    flush: Effect;
    cancel: Effect;
    activeSketch: Effect;
    deactiveSketch: Effect;
    stopDrawing: Effect;
  };
  reducers: {
    updateDrawMode: Reducer<SketchModelState>;
    addSketchData: Reducer<SketchModelState>;
    updateSketchData: Reducer<SketchModelState>;
    deleteSketchData: Reducer<SketchModelState>;
    resetDirtyData: Reducer<SketchModelState>;
    updateActiveStatus: Reducer<SketchModelState>;
  };
}

const SketchModel: SketchModelType = {
  namespace: 'sketch',

  state: {
    drawMode: '',

    isActive: false,

    isDirty: false,

    addedOids: [],
    updatedOids: [],
    deletedOids: [],
  },

  effects: {
    *load(action, { call, put }) {
      const data = yield call(sketchHelper.storage.load);
      yield put({ type: SKETCH_LOAD, payload: data });
    },
    *active({ payload }, { put }) {
      yield put({ type: 'updateDrawMode', payload });
      switch (payload) {
        case 'point':
          sketchHelper.addPoint();
          break;
        case 'polyline':
          sketchHelper.addLine();
          break;
        case 'polygon':
          sketchHelper.addArea();
          break;
        case 'extrude':
          sketchHelper.addExtrude();
          break;
        default:
          break;
      }
    },
    *flush({ payload }, { put, call, select }) {
      notification.info({
        message: '提示',
        description: '保存绘制的图形',
      });

      const added = yield select(store => store.sketch.addedOids);
      const update = yield select(store => store.sketch.updatedOids);
      const deleted = yield select(store => store.sketch.deletedOids);

      // let resp;
      if (added.length > 0 || update.length > 0 || deleted.length > 0) {
        // flush added & updated data to server
        // resp = yield call(saveSketchGraphic, [
        //   ...sketchHelper.convertOidToDataStruct4Add(added),
        //   ...sketchHelper.convertOidToDataStruct4Update(update),
        // ]);

        // LocalStorage是全删全写的模式
        yield call(sketchHelper.storage.save, sketchHelper.getLatestDataSet());
      }

      // flush deleted data to server
      // if (deleted.length > 0) {
      // resp = yield call(delSketchGraphic, deleted);
      // }

      notification.info({
        message: '提示',
        description: '保存成功',
      });
      yield put({ type: 'resetDirtyData' });
    },
    *cancel(action, { put, call }) {
      yield put({ type: 'resetDirtyData' });

      // reload data from server
      // const exists = yield call(getAllSketchGraphics);
      // if (exists.data) {
      // yield put({ type: SKETCH_RELOAD, payload: exists.data });
      // }
    },
    *activeSketch({ payload }, { put }) {
      yield put({ type: 'updateActiveStatus', payload: true });
      sketchHelper.active();
    },
    *deactiveSketch({ payload }, { put }) {
      yield put({ type: 'updateActiveStatus', payload: false });
      yield put({ type: 'updateDrawMode', payload: '' });
      sketchHelper.deactive();
    },
    *stopDrawing(noop, { put }) {
      yield put({ type: 'updateDrawMode', payload: '' });
      sketchHelper.stopDraw();
    },
  },

  reducers: {
    updateDrawMode(state, action): SketchModelState {
      return { ...state, drawMode: action.payload };
    },
    addSketchData(state, action): SketchModelState {
      const ret = {
        ...state,
        isDirty: true,
      };
      if (state && state.addedOids) {
        ret.addedOids = [...state.addedOids, action.payload];
      }

      return ret;
    },
    updateSketchData(state, action): SketchModelState {
      const newState: SketchModelState = { ...state };
      if (state) {
        if (!state.isDirty) {
          newState.isDirty = true;
        }
        if (
          (state.addedOids && state.addedOids.indexOf(action.payload) > -1) ||
          (state.updatedOids && state.updatedOids.indexOf(action.payload) > -1)
        ) {
          return newState;
        }

        if (state.updatedOids) {
          newState.updatedOids = [...state.updatedOids, action.payload];
        }
      }
      return newState;
    },
    deleteSketchData(state, action): SketchModelState {
      const newState: SketchModelState = { ...state };
      if (state) {
        if (state.addedOids && state.addedOids.indexOf(action.payload) > -1) {
          const idx = state.addedOids.indexOf(action.payload);
          newState.addedOids = [
            ...state.addedOids.slice(0, idx),
            ...state.addedOids.slice(idx + 1),
          ];
          return newState;
        }
        if (state.updatedOids && state.updatedOids.indexOf(action.payload) > -1) {
          const idx = state.updatedOids.indexOf(action.payload);
          newState.updatedOids = [
            ...state.updatedOids.slice(0, idx),
            ...state.updatedOids.slice(idx + 1),
          ];
        }

        if (state.deletedOids) {
          newState.deletedOids = [...state.deletedOids, action.payload];
        }
      }
      return newState;
    },
    resetDirtyData(state, action): SketchModelState {
      return { ...state, isDirty: false, addedOids: [], updatedOids: [], deletedOids: [] };
    },
    updateActiveStatus(state, action): SketchModelState {
      return { ...state, isActive: action.payload };
    },
  },
};

export default SketchModel;
