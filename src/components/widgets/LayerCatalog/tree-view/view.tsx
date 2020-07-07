import React from 'react';
import _ from 'lodash';
import { Tree } from 'antd';
import { connect } from 'umi';
import {
  convertItem2TreeData,
  findItemById,
} from '@/components/widgets/LayerCatalog/data/converter';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { LayersModelState } from '@/models/layers';
import { ConnectProps, ConnectState } from '@/models/connect';

export interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface TreeViewPropTypes {
  data: CatalogItem[];
}

const TreeView: React.FC<TreeViewPropTypes & ConnectedProps> = ({ dispatch, layers, data }) => {
  function handleContext(item: CatalogItem) {
    if (dispatch) {
      dispatch({
        type: 'layers/startEditSymbol',
        payload: item,
      });
    }
  }

  return (
    <Tree
      blockNode
      selectable={false}
      checkedKeys={layers.loadedKeys}
      className="geomap-widget-layer-catalog__tree"
      treeData={convertItem2TreeData(data, {
        context: handleContext,
      })}
    />
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(TreeView);
