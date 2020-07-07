import React from 'react';
import _ from 'lodash';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import nodeFactory from './node-factory';

export interface TreeViewPropTypes {
  data: CatalogItem[];
}

const CollapseView: React.FC<TreeViewPropTypes> = ({ data }) => {
  function renderNodes() {
    return _.map(data, d => {
      return nodeFactory.instance().render(d);
    });
  }

  return (
    <div className="geomap-widget-layer-catalog__collapse">
      <div className="geomap-widget-layer-catalog__collapse-content">{renderNodes()}</div>
    </div>
  );
};

export default CollapseView;
