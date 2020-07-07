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

/**
 * TODO: yanwh - 修改为针对WaterSymbol属性的编辑器
 * @param layers
 * @constructor
 */
const WaterEditor: React.FC<WaveEditorPropTypes & ConnectedProps> = ({ layers }) => {
  return (
    <div className="geomap-widget-symbol-editor__elevation">
      <div className="geomap-widget-symbol-editor__elevation-title">特效渲染</div>
      <div className="geomap-widget-symbol-editor__elevation-select">
        <div className="geomap-widget-symbol-editor__elevation-select-row">
          <span className="geomap-widget-symbol-editor__elevation-select-label">选择效果</span>
          <Select
            onChange={value => {
              if (value === 'wave') {
                const renderer = {
                  type: 'simple',
                  symbol: {
                    type: 'polygon-3d',
                    symbolLayers: [
                      {
                        type: 'water',
                        waveDirection: 260,
                        color: '#25427c',
                        waveStrength: 'moderate',
                        waterbodySize: 'medium',
                      },
                    ],
                  },
                };
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
                  layers.currentSymbolEditItem.layer.renderer = renderer;
                }
              }
            }}
          >
            <Option key="0" value="wave">
              水波纹
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
    </div>
  );
};
export default connect(({ layers }: ConnectState) => {
  return { layers };
})(WaterEditor);
