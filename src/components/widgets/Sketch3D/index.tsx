import React, { FC, useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import classes from 'classnames';
import _ from 'lodash';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';
import sketchUtil, { SKETCH_LAYER_ID } from '@/utils/sketch';
import { SketchModelState } from '@/models/sketch';
import './index.less';

interface ConnectedProps extends ConnectProps {
  maptoolbar: MaptoolbarModelState;
  sketch: SketchModelState;
}

export interface Sketch3DPropTypes {}

function isSketchLayerAdded() {
  if (window.agsGlobal && window.agsGlobal.view) {
    return window.agsGlobal.view.map.layers.findIndex(l => l.id === SKETCH_LAYER_ID) > -1;
  }
  return false;
}

const Sketch3D: FC<Sketch3DPropTypes & ConnectedProps> = ({ dispatch, maptoolbar, sketch }) => {
  const [initialized, setInit] = useState(false);
  const [canDel, setCanDel] = useState(false);
  const handleRef = useRef<__esri.Handles>();

  useEffect(() => {
    if (maptoolbar.activeToolbar === 'plotting') {
      // 判断地图上是否存在标绘图层

      if (isSketchLayerAdded()) {
        setInit(true);
        sketchUtil.active();

        handleRef.current = sketchUtil.sketchVm.updateGraphics.on('change', () => {
          if (sketchUtil.sketchVm && sketchUtil.sketchVm.updateGraphics.length > 0) {
            setCanDel(true);
          } else {
            setCanDel(false);
          }
        });
      }
    } else {
      if (handleRef.current) {
        handleRef.current.remove();
        handleRef.current = undefined;
      }
    }

    return () => {
      sketchUtil.deactive();
    };
  }, [maptoolbar.activeToolbar]);

  function renderWidget() {
    return (
      <div className="geomap-widget-sketch">
        <span
          className={classes('geomap-widget-sketch__item', {
            active: sketch.drawMode === 'point',
          })}
          onClick={() => {
            if (_.isFunction(dispatch)) {
              dispatch({
                type: 'sketch/active',
                payload: 'point',
              });
            }
          }}
        >
          <img
            alt=""
            src={
              sketch.drawMode === 'point'
                ? require('./images/sketch-point-active.png')
                : require('./images/sketch-point.png')
            }
          />
        </span>
        <span
          className={classes('geomap-widget-sketch__item', {
            active: sketch.drawMode === 'polyline',
          })}
          onClick={() => {
            if (_.isFunction(dispatch)) {
              dispatch({
                type: 'sketch/active',
                payload: 'polyline',
              });
            }
          }}
        >
          <img
            alt=""
            src={
              sketch.drawMode === 'polyline'
                ? require('./images/sketch-line-active.png')
                : require('./images/sketch-line.png')
            }
          />
        </span>

        <span
          className={classes('geomap-widget-sketch__item', {
            active: sketch.drawMode === 'extrude',
          })}
          onClick={() => {
            if (_.isFunction(dispatch)) {
              dispatch({
                type: 'sketch/active',
                payload: 'extrude',
              });
            }
          }}
        >
          <img
            alt=""
            src={
              sketch.drawMode === 'extrude'
                ? require('./images/sketch-area-active.png')
                : require('./images/sketch-area.png')
            }
          />
        </span>
        <div className="geomap-widget-sketch__divide" />
        <span
          className="geomap-widget-sketch__item"
          onClick={() => {
            if (_.isFunction(dispatch)) {
              dispatch({
                type: 'layers/startEditSymbol',
                payload: sketchUtil.item,
              });
            }
          }}
        >
          <img alt="" src={require('./images/symbol.png')} />
        </span>
        <div className="geomap-widget-sketch__divide" />
        <span
          className={classes('geomap-widget-sketch__item', {
            disabled: !canDel,
          })}
          onClick={() => {
            if (!canDel) return;

            if (sketchUtil.sketchVm && sketchUtil.sketchVm.updateGraphics.length > 0) {
              const oid = sketchUtil.sketchVm.updateGraphics.items[0].attributes.ObjectId;
              sketchUtil.sketchVm.cancel();
              const gra =
                sketchUtil.item &&
                sketchUtil.item.layer &&
                sketchUtil.item.layer.graphics.find(g => g.attributes.ObjectId === oid);
              if (gra) {
                sketchUtil.item && sketchUtil.item.layer && sketchUtil.item.layer.remove(gra);

                if (_.isFunction(dispatch)) {
                  dispatch({
                    type: 'sketch/deleteSketchData',
                    payload: oid,
                  });
                }
              }
            }
          }}
        >
          <img alt="" src={require('./images/delete.png')} />
        </span>
        {sketch.isDirty ? (
          <span
            className="geomap-widget-sketch__item"
            onClick={() => {
              if (_.isFunction(dispatch)) {
                dispatch({
                  type: 'sketch/flush',
                });
              }
            }}
          >
            <img alt="" src={require('./images/save.png')} />
          </span>
        ) : (
          <span className="geomap-widget-sketch__item" title={'所有数据已保存'}>
            <img alt="" src={require('./images/apply.png')} />
          </span>
        )}
        <span
          className="geomap-widget-sketch__item"
          onClick={() => {
            if (sketch.drawMode) {
              sketchUtil.stopDraw();
              if (_.isFunction(dispatch)) {
                dispatch({
                  type: 'sketch/updateDrawMode',
                  payload: '',
                });
              }
            } else {
              if (_.isFunction(dispatch)) {
                dispatch({
                  type: 'maptoolbar/updataActiveToolbar',
                  payload: '',
                });
              }
            }
          }}
        >
          <img
            alt=""
            src={sketch.drawMode ? require('./images/cancel.png') : require('./images/close.png')}
          />
        </span>
      </div>
    );
  }

  function renderLoading() {
    return (
      <span className="geomap-widget-sketch__item loading">
        <img alt="" src={require('./images/loading.png')} />
      </span>
    );
  }

  return (
    <div className="geomap-widget-sketch__container">
      <div className="geomap-widget-sketch__container-inner">
        {initialized ? renderWidget() : renderLoading()}
      </div>
    </div>
  );
};

export default connect(({ maptoolbar, sketch }: ConnectState) => {
  return { maptoolbar, sketch };
})(Sketch3D);
