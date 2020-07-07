import React, { useState, useRef, useCallback, CSSProperties } from 'react';
import { Tooltip } from 'antd';
import { MenuUnfoldOutlined, UnorderedListOutlined } from '@ant-design/icons';
import classes from 'classnames';
import { useEffectOnce } from 'react-use';
import _ from 'lodash';
import CatalogTreeView from './tree-view/view';
import CatalogCollapseView from './collapse-view/view';
import { loadCatalogJson } from '@/services/app-config';
import CatalogItem, { CatalogItemStatus } from '@/components/widgets/LayerCatalog/data/CatalogItem';
import './index.less';

export interface LayerCatalogPropTypes {
  className?: string;
  style?: CSSProperties;
}

const TreeView = 'tree';
const CollapseView = 'collapse';

const LayerCatalog: React.FC<LayerCatalogPropTypes> = ({ className, style }) => {
  const [dataSrc, setData] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayAs, displayChange] = useState<string>(TreeView);
  const [, forceUpdate] = useState();
  const scheduleRender = useCallback(() => forceUpdate({}), []);

  function notifyChange(id: string, status: CatalogItemStatus) {
    setLoading(true);
    scheduleRender();
  }

  function completeChange(id: string, status: CatalogItemStatus) {
    setLoading(false);
    scheduleRender();
  }

  useEffectOnce(() => {
    loadCatalogJson().then(json => {
      if (_.isArray(json.data)) {
        setData(
          _.map(json.data, d => {
            return new CatalogItem(d);
          }),
        );
      }
    });
  });

  function renderView() {
    switch (displayAs) {
      case TreeView: {
        return <CatalogTreeView data={dataSrc} />;
      }
      case CollapseView: {
        return <CatalogCollapseView data={dataSrc} />;
      }
      default:
        break;
    }
    return null;
  }

  function _render() {
    const busy = loading ? <span>1</span> : null;
    const selected = 0; // TODO: 根据存储在redux store中的key length计算
    const count = _.sumBy(dataSrc, d => d.count());

    return (
      <div className={classes('geomap-widget-layer-catalog', className)} style={style}>
        {busy}
        <div className="geomap-widget-layer-catalog__bar">
          <span className="geomap-widget-layer-catalog__bar-text">
            总计： {count}，已选择：{selected}
          </span>
          <span className="geomap-widget-layer-catalog__bar-actions">
            <Tooltip title="面板展示" placement={'bottom'}>
              <span
                className={classes('geomap-widget-layer-catalog__bar-action', {
                  active: displayAs === CollapseView,
                })}
                onClick={() => {
                  if (displayAs !== CollapseView) displayChange(CollapseView);
                }}
              >
                <UnorderedListOutlined />
              </span>
            </Tooltip>
            <Tooltip title="树形展示" placement={'bottom'}>
              <span
                className={classes('geomap-widget-layer-catalog__bar-action', {
                  active: displayAs === TreeView,
                })}
                onClick={() => {
                  if (displayAs !== TreeView) displayChange(TreeView);
                }}
              >
                <MenuUnfoldOutlined />
              </span>
            </Tooltip>
          </span>
        </div>
        {renderView()}
      </div>
    );
  }

  return _render();
};

export default LayerCatalog;
