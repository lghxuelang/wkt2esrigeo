import React from 'react';
import _ from 'lodash';
import CustomTreeNode from '../tree-view/TreeNode';
import CatalogItem, { CatalogItemStatus } from '@/components/widgets/LayerCatalog/data/CatalogItem';

export interface TreeConvertOptions {
  context: (item: CatalogItem) => void;
}

export function convertItem2TreeData(items: CatalogItem[], opts: TreeConvertOptions): any[] {
  return _.map(items, i => {
    const ret: {
      key: string;
      title: React.ReactNode;
      children?: object[];
    } = {
      key: i.id,
      title: <CustomTreeNode item={i} />,
    };

    if (i.hasChild()) {
      ret.children = convertItem2TreeData(i.children || [], opts);
    }

    return ret;
  });
}

function loopFindById(items: CatalogItem[], id: string) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.id === id) {
      return item;
    }
    if (item.hasChild()) {
      const findChildren = loopFindById(item.children || [], id);
      if (findChildren) {
        return findChildren;
      }
    }
  }

  return null;
}

export function findItemById(items: CatalogItem[], id: string): CatalogItem | null {
  return loopFindById(items, id);
}
