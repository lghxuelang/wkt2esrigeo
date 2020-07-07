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

export interface ElevationInfoPropTypes {}

const ElevationInfo: React.FC<ElevationInfoPropTypes & ConnectedProps> = ({ layers }) => {
  const [mode, setMode] = useState<string>(
    (layers.currentSymbolEditItem &&
      layers.currentSymbolEditItem.layer &&
      layers.currentSymbolEditItem.layer.elevationInfo &&
      layers.currentSymbolEditItem.layer.elevationInfo.mode) ||
      null,
  );
  const [unit, setUnit] = useState('meters');
  const [offset, setOffset] = useState(0);

  function renderOptions() {
    let content;
    if (mode !== 'on-the-ground') {
      content = (
        <div className="geomap-widget-symbol-editor__elevation-offset">
          <span className="geomap-widget-symbol-editor__elevation-offset-label">偏移距离</span>
          <Input
            value={offset}
            onChange={e => {
              const val = e.currentTarget.value;
              const iVal = parseInt(val, 10);
              if (!_.isNaN(iVal)) {
                setOffset(iVal);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
                  layers.currentSymbolEditItem.layer.elevationInfo.offset = iVal;
                }
              }
            }}
          />
          <Select
            value={unit}
            onChange={val => {
              setUnit(val);
              if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
                layers.currentSymbolEditItem.layer.elevationInfo.unit = val;
              }
            }}
          >
            <Option key={0} value={'feet'}>
              feet
            </Option>
            <Option key={1} value={'meters'}>
              meters
            </Option>
            <Option key={2} value={'kilometers'}>
              kilometers
            </Option>
            <Option key={3} value={'miles'}>
              miles
            </Option>
            <Option key={4} value={'us-feet'}>
              us-feet
            </Option>
            <Option key={5} value={'yards'}>
              yards
            </Option>
          </Select>
        </div>
      );
    }
    if (content) {
      return <div className="geomap-widget-symbol-editor__elevation-options">{content}</div>;
    }
    return null;
  }

  return (
    <div className="geomap-widget-symbol-editor__elevation">
      <div className="geomap-widget-symbol-editor__elevation-title">高程模式</div>
      <div className="geomap-widget-symbol-editor__elevation-select">
        <div className="geomap-widget-symbol-editor__elevation-select-row">
          <span className="geomap-widget-symbol-editor__elevation-select-label">对地关系</span>
          <Select
            defaultValue={mode}
            onChange={value => {
              setMode(value);
              if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
                layers.currentSymbolEditItem.layer.elevationInfo = {
                  mode: value,
                  offset: _.get(layers.currentSymbolEditItem.layer.elevationInfo, 'offset'),
                  unit: _.get(layers.currentSymbolEditItem.layer.elevationInfo, 'unit'),
                  featureExpressionInfo: _.get(
                    layers.currentSymbolEditItem.layer.elevationInfo,
                    'featureExpressionInfo',
                  ),
                };
              }
            }}
          >
            <Option key="0" value="on-the-ground">
              On the ground
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
      {renderOptions()}
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(ElevationInfo);
