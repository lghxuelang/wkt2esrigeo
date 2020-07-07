import React, { FC, useState } from 'react';
import { connect } from 'umi';
import _ from 'lodash';
import classes from 'classnames';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import ColorEditor from '@/components/widgets/SymbolEditor/editors/ColorEditor';
import OutlineEditor from '@/components/widgets/SymbolEditor/editors/OutlineEditor';
import EdgeRenderEditor from '@/components/widgets/SymbolEditor/editors/EdgeRenderEditor';
import GeoSimpleRenderer from '@/core/smart-mapping/renderers/GeoSimpleRenderer';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface SimpleEditorPropTypes {}

const SimpleEditor: FC<SimpleEditorPropTypes & ConnectedProps> = ({ layers }) => {
  function getCurrentFillColorValue() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
      if (renderer.symbolType === '2d' && renderer.symbol) {
        const currVal = renderer.symbol.current && _.get(renderer.symbol.current, 'color');
        const servVal = renderer.symbol.server && _.get(renderer.symbol.server, 'color');

        return currVal || servVal || 'red';
      } else if (renderer.symbolType === '3d' && renderer.symbol3D) {
        const currVal3D = renderer.symbol3D.current && _.get(renderer.symbol3D.current, 'color');
        const servVal3D = renderer.symbol3D.server && _.get(renderer.symbol3D.server, 'color');

        return currVal3D || servVal3D || 'red';
      }
    }

    return 'green';
  }

  function getCurrentOutlineColor() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
      if (renderer.symbolType === '2d' && renderer.symbol) {
        return (
          (renderer.symbol.current && _.get(renderer.symbol.current, 'outline.color')) || 'red'
        );
      } else if (renderer.symbolType === '3d' && renderer.symbol3D) {
        return (
          (renderer.symbol3D.current && _.get(renderer.symbol3D.current, 'outline.color')) || 'red'
        );
      }
    }

    return 'green';
  }

  const [renderFrom, setRenderFrom] = useState('server');
  const [symbolType, setSymbolType] = useState(
    (layers.currentSymbolEditItem &&
      layers.currentSymbolEditItem.renderMgr &&
      layers.currentSymbolEditItem.renderMgr.renderer &&
      (layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer).symbolType) ||
      '2d',
  );
  // const [useFill, setFill] = useState<boolean>(
  //   layers.currentSymbolEditItem &&
  //     layers.currentSymbolEditItem.layer &&
  //     layers.currentSymbolEditItem.layer.renderer &&
  //     layers.currentSymbolEditItem.layer.renderer.symbol.color !== null,
  // );
  // const [useOutline, setOutline] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState(getCurrentFillColorValue());
  const [outlineColor, setOutlineColor] = useState(getCurrentOutlineColor());

  function switchClientSymbol() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
      if (renderer) {
        if (renderer.symbolType === '2d') {
          renderer.symbol && renderer.symbol.useLatestClientSymbol();
        } else {
          renderer.symbol3D && renderer.symbol3D.useLatestClientSymbol();
        }
      }
    }

    if (renderFrom !== 'client') setRenderFrom('client');
  }

  function switchServerSymbol() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
      if (renderer) {
        renderer.useServerSymbol();
      }
    }

    if (renderFrom !== 'server') setRenderFrom('server');
  }

  function renderClientOptions() {
    return renderFrom === 'client' ? (
      <>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">渲染类型</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <span
              className={classes('geomap-widget-symbol-editor__styling-row-btn', {
                active: symbolType === '2d',
              })}
              onClick={() => {
                if (symbolType !== '2d') {
                  setSymbolType('2d');

                  const item = layers.currentSymbolEditItem;
                  if (item && item.renderMgr) {
                    const renderer = item.renderMgr.renderer as GeoSimpleRenderer;
                    if (renderer) {
                      renderer.symbolType = '2d';
                      const last = renderer.lastSymbolOrDefault();
                      if (last) {
                        renderer.renderToLayer(last.toEsriSymbolObject());
                        setFillColor(getCurrentFillColorValue());
                        // TODO: reset other properties
                      }
                    }
                  }
                }
              }}
            >
              二维符号
            </span>
            <span
              className={classes('geomap-widget-symbol-editor__styling-row-btn', {
                active: symbolType === '3d',
              })}
              onClick={() => {
                if (symbolType !== '3d') {
                  setSymbolType('3d');

                  const item = layers.currentSymbolEditItem;
                  if (item && item.renderMgr) {
                    const renderer = item.renderMgr.renderer as GeoSimpleRenderer;
                    if (renderer) {
                      renderer.symbolType = '3d';
                      const last = renderer.lastSymbolOrDefault();
                      if (last) {
                        renderer.renderToLayer(last.toEsriSymbolObject());
                        setFillColor(getCurrentFillColorValue());
                        // TODO: reset other properties
                      }
                    }
                  }
                }
              }}
            >
              三维拉伸
            </span>
          </div>
        </div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">填充颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={fillColor}
              onChange={color => {
                setFillColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSimpleRenderer;
                  if (renderer) {
                    renderer.setPropValue('color', color);
                  }
                }
              }}
            />
          </div>
        </div>
        {symbolType === '3d' ? (
          <EdgeRenderEditor />
        ) : (
          <>
            <div className="geomap-widget-symbol-editor__styling-row">
              <span className="geomap-widget-symbol-editor__styling-row-label">轮廓颜色</span>
              <div className="geomap-widget-symbol-editor__styling-row-wrap">
                <ColorEditor
                  color={outlineColor}
                  onChange={color => {
                    setOutlineColor(color);

                    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                      const renderer = layers.currentSymbolEditItem.renderMgr
                        .renderer as GeoSimpleRenderer;
                      if (renderer) {
                        renderer.setPropValue('outline.color', color);
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="geomap-widget-symbol-editor__styling-row">
              <span className="geomap-widget-symbol-editor__styling-row-label">轮廓大小</span>
              <div className="geomap-widget-symbol-editor__styling-row-wrap">
                <OutlineEditor />
              </div>
            </div>
          </>
        )}
      </>
    ) : null;
  }

  return (
    <div className="geomap-widget-symbol-editor__styling">
      <div className="geomap-widget-symbol-editor__styling-title">符号设置</div>
      <div className="geomap-widget-symbol-editor__styling-row">
        <span className="geomap-widget-symbol-editor__styling-row-label">类型</span>
        <div className="geomap-widget-symbol-editor__styling-row-wrap">
          <span
            className={classes('geomap-widget-symbol-editor__styling-row-btn', {
              active: renderFrom === 'server',
            })}
            onClick={switchServerSymbol}
          >
            原始符号
          </span>
          <span
            className={classes('geomap-widget-symbol-editor__styling-row-btn', {
              active: renderFrom === 'client',
            })}
            onClick={switchClientSymbol}
          >
            自定符号
          </span>
        </div>
      </div>
      {renderClientOptions()}
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(SimpleEditor);
