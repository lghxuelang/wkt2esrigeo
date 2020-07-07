import React, { useState } from 'react';
import { Switch } from 'antd';
import _ from 'lodash';
import iconSrc from '../../images/symbology.png';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { connect } from 'umi';
import { LayersModelState } from '@/models/layers';
import { ConnectProps, ConnectState } from '@/models/connect';

export interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface CommonNodePropTypes {
  item: CatalogItem;
}

const CommonNode: React.FC<CommonNodePropTypes & ConnectedProps> = props => {
  const [expanded, expand] = useState<boolean>(false);

  const { dispatch, layers, item } = props;
  return (
    <div className="geomap-widget-layer-catalog__collapse-node">
      <div className="geomap-widget-layer-catalog__collapse-node-item">
        <span>{props.item.getTitle()}</span>
        <span className="geomap-widget-layer-catalog__collapse-node-switch">
          <Switch
            size={'small'}
            checked={props.layers.loadedKeys && props.layers.loadedKeys.indexOf(props.item.id) > -1}
            onClick={checked => {
              if (checked) {
                props.item.addToMap();
                if (dispatch && _.isArray(layers.loadedKeys)) {
                  dispatch({
                    type: 'layers/updateLoadedKeys',
                    payload: [...layers.loadedKeys, item.id],
                  });
                }
              } else {
                props.item.removeFromMap();
                if (dispatch && _.isArray(layers.loadedKeys)) {
                  const idx = layers.loadedKeys.indexOf(item.id);
                  if (idx > -1) {
                    dispatch({
                      type: 'layers/updateLoadedKeys',
                      payload: [
                        ...layers.loadedKeys.slice(0, idx),
                        ...layers.loadedKeys.slice(idx + 1),
                      ],
                    });
                  }
                }
              }
            }}
          />
          <span
            style={{ width: 16, height: 16 }}
            onClick={e => {
              e.preventDefault();

              if (dispatch) {
                dispatch({
                  type: 'layers/startEditSymbol',
                  payload: item,
                });
              }
            }}
          >
            <img
              alt=""
              src={iconSrc}
              width={16}
              height={16}
              style={{
                marginLeft: 22,
                cursor: 'pointer',
              }}
            />
          </span>

          <span style={{ marginLeft: 0, fontSize: 18 }}>
            <div style={{ width: 16 }} />
          </span>
        </span>
      </div>
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(CommonNode);
