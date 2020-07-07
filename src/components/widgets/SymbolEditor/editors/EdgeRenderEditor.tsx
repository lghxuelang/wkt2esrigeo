import React, { FC, useState } from 'react';
import { connect } from 'umi';
import { Select } from 'antd';
import classes from 'classnames';
import { CheckCircleFilled } from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import ColorEditor from '@/components/widgets/SymbolEditor/editors/ColorEditor';
import OutlineEditor from '@/components/widgets/SymbolEditor/editors/OutlineEditor';
import _ from 'lodash';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import GeoSimpleRenderer from '@/core/smart-mapping/renderers/GeoSimpleRenderer';

const Option = Select.Option;

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

const EdgeRenderEditor: FC<ConnectedProps> = ({ layers }) => {
  function getCurrentEdgeColorValue(): string {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      switch (layers.currentSymbolEditItem.renderMgr.currentType) {
        case GeoRendererType.Simple: {
          const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
          const current = renderer.symbol3D && _.get(renderer.symbol3D.current, 'outline.color');
          const server = renderer.symbol3D && _.get(renderer.symbol3D.server, 'outline.color');

          return current || server || 'red';
        }
        default:
          break;
      }
    }

    return 'red';
  }

  const [renderEdge, setRenderEdge] = useState(false);
  const [edgeColor, setEdgeColor] = useState(getCurrentEdgeColorValue());

  function getCurrentEdgeStyle() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      switch (layers.currentSymbolEditItem.renderMgr.currentType) {
        case GeoRendererType.Simple: {
          const renderer = layers.currentSymbolEditItem.renderMgr.renderer as GeoSimpleRenderer;
          const current = renderer.symbol3D && _.get(renderer.symbol3D.current, 'outline.type');

          return current;
        }
        default:
          break;
      }
    }

    return 'solid';
  }

  return (
    <>
      <div className="geomap-widget-symbol-editor__styling-row">
        <span className="geomap-widget-symbol-editor__styling-row-label">边界渲染</span>
        <div className="geomap-widget-symbol-editor__styling-row-wrap">
          <span
            className={classes(
              'geomap-widget-symbol-editor__styling-row-btn',
              'geomap-widget-symbol-editor__styling-edge-btn',
              {
                active: renderEdge,
              },
            )}
            onClick={() => {
              const newVal = !renderEdge;
              setRenderEdge(newVal);

              const item = layers.currentSymbolEditItem;
              if (item && item.renderMgr) {
                switch (item.renderMgr.currentType) {
                  case GeoRendererType.Simple: {
                    const renderer = item.renderMgr.renderer as GeoSimpleRenderer;
                    if (renderer) {
                      renderer.setPropValue('outlineEnabled', newVal);
                    }
                    break;
                  }
                  default:
                    break;
                }
              }
            }}
          >
            轮廓线
            {renderEdge ? <CheckCircleFilled /> : null}
          </span>
          <Select
            defaultValue={getCurrentEdgeStyle()}
            disabled={!renderEdge}
            onChange={value => {
              const item = layers.currentSymbolEditItem;
              if (item && item.renderMgr) {
                switch (item.renderMgr.currentType) {
                  case GeoRendererType.Simple: {
                    const renderer = item.renderMgr.renderer as GeoSimpleRenderer;
                    if (renderer) {
                      renderer.setPropValue('outline.type', value);
                    }
                    break;
                  }
                  default:
                    break;
                }
              }
            }}
          >
            <Option key={0} value={'solid'}>
              Solid
            </Option>
            <Option key={1} value={'sketch'}>
              Sketch
            </Option>
          </Select>
        </div>
      </div>
      {renderEdge ? (
        <>
          <div className="geomap-widget-symbol-editor__styling-row">
            <span className="geomap-widget-symbol-editor__styling-row-label">边界颜色</span>
            <div className="geomap-widget-symbol-editor__styling-row-wrap">
              <ColorEditor
                color={edgeColor}
                onChange={color => {
                  setEdgeColor(color);

                  const item = layers.currentSymbolEditItem;
                  if (item && item.renderMgr) {
                    switch (item.renderMgr.currentType) {
                      case GeoRendererType.Simple: {
                        const renderer = item.renderMgr.renderer as GeoSimpleRenderer;
                        if (renderer) {
                          renderer.setPropValue('outline.color', color);
                        }
                        break;
                      }
                      default:
                        break;
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="geomap-widget-symbol-editor__styling-row">
            <span className="geomap-widget-symbol-editor__styling-row-label">边界线宽</span>
            <div className="geomap-widget-symbol-editor__styling-row-wrap">
              <OutlineEditor />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(EdgeRenderEditor);
