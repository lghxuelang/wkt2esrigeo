import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { connect } from 'umi';
import _ from 'lodash';
import { ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';

const { Option } = Select;
interface ConnectedProps {
  layers: LayersModelState;
}
export interface WaveEditorPropTypes {}

  const PointRender: React.FC<WaveEditorPropTypes & ConnectedProps> = ({ layers }) => {
  return (
    <div className="geomap-widget-symbol-editor__elevation">
      <div className="geomap-widget-symbol-editor__elevation-title">特效渲染</div>
      <div className="geomap-widget-symbol-editor__elevation-select">
        <div className="geomap-widget-symbol-editor__elevation-select-row">
          <span className="geomap-widget-symbol-editor__elevation-select-label">选择效果</span>
          <Select
            onChange={value => {
              if (value === 'billboard') {
                const iconRenderer = {
                  type: "simple",
                  symbol: {
                    type: "point-3d",
                    symbolLayers: [
                      {
                        type: "icon",
                        resource: {
                          href: "./images/icon.png"
                        },
                        size: 126,
                        outline: {
                          color: "white",
                          size: 2
                        },
                        anchor: "relative",
                        anchorPosition: {
                          x: 0,
                          y: 0.5
                        }
                      }
                    ],
                  }
                };
                const labelingInfo = [
                  {
                    labelExpressionInfo: {
                      value: "{Name}"
                    },
                    labelPlacement: "center-center",
                    symbol: {
                      type: "label-3d",
                      symbolLayers: [
                        {
                          type: "text",
                          material: {
                            color: "white",
                          },
                          size: 8,
                        },
                      ],
                    }
                  }
                ]
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
                  layers.currentSymbolEditItem.layer.renderer = iconRenderer;
                  layers.currentSymbolEditItem.layer.labelingInfo = labelingInfo;
                }
              }
            }}
          >
            <Option key="0" value="billboard">
              广告牌
            </Option>
            <Option key="1" value="absolute-height">
              Absolute height
            </Option>
            <Option key="2" value="relative-to-ground">
              Relative to ground
            </Option>
            <Option key="3" value="relative-to-scene">
              Relative to scene
            </Option>
          </Select>
        </div>
      </div>
      {/*{renderOptions()}*/}
    </div>
  );
};
export default connect(({ layers }: ConnectState) => {
  return { layers };
})(PointRender);
