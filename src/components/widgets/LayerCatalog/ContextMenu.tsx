import React, { FC } from 'react';
import { Menu } from 'antd';
import { connect } from 'umi';
import _ from 'lodash';
import { PicLeftOutlined } from '@ant-design/icons';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { ConnectProps } from '@/models/connect';

const MenuItem = Menu.Item;

interface ConnectedProps extends ConnectProps {}

export interface ContextMenuPropTypes {
  item: CatalogItem;
  onMenuClick: (key: string) => void;
}

const ContextMenu: FC<ContextMenuPropTypes & ConnectedProps> = ({
  dispatch,
  item,
  onMenuClick,
}) => {
  function notifyClick(key) {
    if (_.isFunction(onMenuClick) && _.isString(key)) {
      onMenuClick(key);
    }
  }

  function handleMenuItemClick({ key }) {
    notifyClick(key);

    switch (key) {
      case 'full-extent': {
        break;
      }
      case 'symbol-edit': {
        if (_.isFunction(dispatch)) {
          dispatch({
            type: 'layers/startEditSymbol',
            payload: item,
          });
        }
        break;
      }
      case 'feature-edit': {
        break;
      }
      default:
        break;
    }
  }

  return (
    <Menu selectable={false} className="geomap-widget-layer-context" onClick={handleMenuItemClick}>
      <MenuItem key={'full-extent'} className="geomap-widget-layer-context__item">
        <PicLeftOutlined />
        <span>缩放至</span>
      </MenuItem>
      <Menu.Divider />
      <MenuItem key={'symbol-edit'} className="geomap-widget-layer-context__item">
        <img alt="" src={require('./images/symbol.png')} />
        <span>符号化</span>
      </MenuItem>
      <MenuItem key={'feature-edit'} className="geomap-widget-layer-context__item">
        <img alt="" src={require('./images/edit.png')} />
        <span>要素编辑</span>
      </MenuItem>
    </Menu>
  );
};

export default connect()(ContextMenu);
