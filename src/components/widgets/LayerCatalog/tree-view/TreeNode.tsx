import React, { FC, useState } from 'react';
import { connect } from 'umi';
import {
  BorderOutlined,
  CheckSquareTwoTone,
  ExclamationCircleTwoTone,
  LoadingOutlined,
  SmallDashOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import CatalogItem, { CatalogItemStatus } from '@/components/widgets/LayerCatalog/data/CatalogItem';
import ContextMenu from '@/components/widgets/LayerCatalog/ContextMenu';
import editSrc from '../images/symbology.png';
import { useEffectOnce } from 'react-use';
import _ from 'lodash';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface TreeNodePropTypes {
  item: CatalogItem;
}

const TreeNode: FC<TreeNodePropTypes & ConnectedProps> = ({ dispatch, layers, item }) => {
  const [s, updateS] = useState(item.status);
  const [contextOpen, isContextOpen] = useState(false);

  useEffectOnce(() => {
    const callback = ({ status }) => {
      updateS(status);
    };

    item.on('status-change', callback);

    return () => {
      item.off('status-change', callback);
    };
  });

  function getIcon() {
    switch (s) {
      case CatalogItemStatus.NotLoad: {
        return <BorderOutlined />;
      }
      case CatalogItemStatus.Loading: {
        return <LoadingOutlined />;
      }
      case CatalogItemStatus.Loaded: {
        return <CheckSquareTwoTone />;
      }
      case CatalogItemStatus.Failure: {
        return <ExclamationCircleTwoTone twoToneColor="#eb2f96" />;
      }
      default:
        break;
    }

    return null;
  }

  function handleIconClick() {
    if (item.status === CatalogItemStatus.NotLoad) {
      item.addToMap();
      if (dispatch && _.isArray(layers.loadedKeys)) {
        dispatch({
          type: 'layers/updateLoadedKeys',
          payload: [...layers.loadedKeys, item.id],
        });
      }
    } else if (item.status === CatalogItemStatus.Loaded) {
      item.removeFromMap();
      if (dispatch && _.isArray(layers.loadedKeys)) {
        const idx = layers.loadedKeys.indexOf(item.id);
        if (idx > -1) {
          dispatch({
            type: 'layers/updateLoadedKeys',
            payload: [...layers.loadedKeys.slice(0, idx), ...layers.loadedKeys.slice(idx + 1)],
          });
        }
      }
    }
  }

  return (
    <div className="geomap-widget-layer-catalog__tree-node">
      <span className="geomap-widget-layer-catalog__tree-node-icon" onClick={handleIconClick}>
        {getIcon()}
      </span>
      <span className="geomap-widget-layer-catalog__tree-node-text" title={item.getTitle()}>
        {item.getTitle()}
      </span>
      {!item.hasChild() ? (
        <span className="geomap-widget-layer-catalog__tree-node-actions">
          <span className="geomap-widget-layer-catalog__tree-node-action">
            <Dropdown
              visible={contextOpen}
              onVisibleChange={isContextOpen}
              overlay={
                <ContextMenu
                  item={item}
                  onMenuClick={key => {
                    isContextOpen(false);
                  }}
                />
              }
            >
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <SmallDashOutlined />
              </a>
            </Dropdown>
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(TreeNode);
