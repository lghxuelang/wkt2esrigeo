import React from 'react';
import { Collapse } from 'antd';
import _ from 'lodash';
import CatalogItem from '@/components/widgets/LayerCatalog/data/CatalogItem';
import { BaseAdapter } from '@/components/widgets/LayerCatalog/collapse-view/adapters/base';
import CommonNode from '@/components/widgets/LayerCatalog/collapse-view/nodes/CommonNode';

const Panel = Collapse.Panel;

export default class NodeFactory {
  registry: Map<string, BaseAdapter>;

  private static _instance: NodeFactory;

  static instance() {
    if (!NodeFactory._instance) {
      NodeFactory._instance = new NodeFactory();
    }
    return NodeFactory._instance;
  }

  constructor() {
    this.registry = new Map<string, BaseAdapter>();
  }

  renderSingleNode(item: CatalogItem) {
    const key = item.id;
    if (key) {
      if (this.registry.has(key)) {
        const adapter = this.registry.get(key);
        return (adapter && adapter.create(item)) || null;
      } else {
        return <CommonNode item={item} />;
      }
    }
  }

  render(item: CatalogItem, props?: object) {
    if (!item) {
      return null;
    }

    const isAccordion = item.hasChild();
    if (!isAccordion) {
      return this.renderSingleNode(item);
    } else {
      return (
        <Collapse accordion>
          <Panel key={item.id} header={item.getTitle()}>
            {_.map(item.children, c => {
              return this.render(c, props);
            })}
          </Panel>
        </Collapse>
      );
    }
  }
}
