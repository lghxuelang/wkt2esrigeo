import React, { FC } from 'react';
import { Popover } from 'antd';
import { connect } from 'umi';
import _ from 'lodash';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import ColorValueEditor from '@/components/widgets/SymbolEditor/editors/ColorValueEditor';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface ColorEditorPropTypes {
  color: string;
  onChange: (color: string) => void;
}

const ColorEditor: FC<ColorEditorPropTypes & ConnectedProps> = ({ onChange, color }) => {
  function handleValueChange(color) {
    if (_.isFunction(onChange)) {
      onChange(color);
    }
  }

  return (
    <Popover
      trigger="click"
      placement="left"
      content={<ColorValueEditor color={color} onChange={handleValueChange} />}
    >
      <span className="geomap-widget-symbol-editor__styling-color-border">
        <span
          className="geomap-widget-symbol-editor__styling-color-stub"
          style={{
            background: color,
          }}
        />
      </span>
    </Popover>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(ColorEditor);
