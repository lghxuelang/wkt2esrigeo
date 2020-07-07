import React, { FC, useState } from 'react';
import { Slider } from 'antd';
import _ from 'lodash';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import { connect } from 'umi';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface OpacityEditorPropTypes {}

const OpacityEditor: FC<OpacityEditorPropTypes & ConnectedProps> = ({ layers }) => {
  function getCurrentOpacityValue() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
      return layers.currentSymbolEditItem.layer.opacity;
    }

    return 1;
  }

  const [opacity, setOpacity] = useState(getCurrentOpacityValue());

  function handleOpacityChange(value) {
    setOpacity(value / 100);
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
      layers.currentSymbolEditItem.layer.opacity = value / 100;
    }
  }

  return (
    <div className="geomap-widget-symbol-editor__opacity">
      <div className="geomap-widget-symbol-editor__opacity-title">透明度</div>
      <div className="geomap-widget-symbol-editor__opacity-content">
        <Slider
          min={0}
          max={100}
          value={Math.floor(opacity * 100)}
          marks={{
            0: '0%',
            100: {
              label: <span style={{ marginRight: 10 }}>100%</span>,
            },
          }}
          onChange={handleOpacityChange}
        />
      </div>
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(OpacityEditor);
