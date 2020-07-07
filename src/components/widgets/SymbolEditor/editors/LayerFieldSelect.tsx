import React, { FC, useState } from 'react';
import { connect } from 'umi';
import { Popover, Select } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';

interface ConnectedProps {
  layers: LayersModelState;
}

export interface LayerFieldSelectPropTypes {
  mode: 'single' | 'multiple';
}

const Option = Select.Option;

const LayerFieldSelect: FC<LayerFieldSelectPropTypes & ConnectedProps> = ({ layers, mode }) => {
  function getCurrentLayerFields() {
    if (layers.currentSymbolEditItem) {
      const { layer } = layers.currentSymbolEditItem;
      if (layer && layer.loaded) {
        const { fields } = layer;
        if (fields) {
          return fields.toArray ? fields.toArray() : fields;
        }
      }
    }

    return [];
  }

  const [fields] = useState(getCurrentLayerFields());
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <>
      <div className="geomap-widget-symbol-editor__fields">
        <span className="geomap-widget-symbol-editor__fields-text">图层字段</span>
        <span className="geomap-widget-symbol-editor__fields-add">
          <Popover
            trigger="click"
            placement="left"
            content={
              <Select
                style={{ width: 150 }}
                value={value}
                onChange={val => {
                  setValue(val);
                }}
              >
                {fields.map(f => {
                  return (
                    <Option key={f.name} title={f.alias || f.name} value={f.name}>
                      {f.alias || f.name}
                    </Option>
                  );
                })}
              </Select>
            }
          >
            <a onClick={e => e.preventDefault()}>
              <PlusOutlined /> 选择
            </a>
          </Popover>
        </span>
      </div>
      <div className="geomap-widget-symbol-editor__fields-selected">
        {value ? (
          <span>
            {value}{' '}
            <a
              onClick={e => {
                e.preventDefault();

                setValue(undefined);
              }}
            >
              <CloseOutlined />
            </a>
          </span>
        ) : null}
      </div>
    </>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(LayerFieldSelect);
