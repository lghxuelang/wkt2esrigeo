import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import classes from 'classnames';
import _ from 'lodash';
import jsapi from '@/utils/arcgis/jsapi';
import LayerListItem from './LayerListItem';
import { ConnectState, ConnectProps } from '@/models/connect';
import { AppModelState } from '@/models/app';
import './index.less';
import LayerListViewModel = __esri.LayerListViewModel;
import watchUtils = __esri.watchUtils;
import Handles = __esri.Handles;
import ListItem = __esri.ListItem;

let widgetId = 'legend-layer-list-widget';

interface ILayerList extends ConnectProps {
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  app: AppModelState;
}

const LayerList: React.FC<ILayerList> = props => {
  const vmRef = useRef<LayerListViewModel>();
  const watchUtilsRef = useRef<watchUtils>();
  const handlesRef = useRef<Handles>();
  const [items, setItems] = useState<ListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [errorsVisible, setErrorVisible] = useState(true);

  function scheduleRender() {
    if (vmRef.current) {
      setItems(
        vmRef.current.operationalItems
          .toArray()
          .filter((item: ListItem) => errorsVisible || !item.error),
      );
    }
  }
  function _renderOnItemChanges(item: ListItem) {
    const itemId = _.get(item, 'uid');
    const registryKey = `items${itemId}`;
    if (handlesRef.current && watchUtilsRef.current) {
      handlesRef.current.add(
        [
          watchUtilsRef.current.init(
            item,
            [
              'actionsOpen',
              'visible',
              'open',
              'updating',
              'title',
              'visibleAtCurrentScale',
              'error',
              'visibilityMode',
              'panel',
              'panel.title',
              'panel.content',
              'panel.className',
            ],
            () => scheduleRender(),
          ),
          item.actionsSections.on('change', () => scheduleRender()),
          item.children.on('change', () => scheduleRender()),
        ],
        registryKey,
      );
    }

    item.children.forEach(child => _renderOnItemChanges(child));
    item.actionsSections.forEach(actionSection => {
      // _watchActionSectionChanges(actionSection, itemId);
    });
  }

  function _itemsChanged() {
    if (handlesRef.current) {
      handlesRef.current.removeAll();
    }
    if (vmRef.current) {
      vmRef.current.operationalItems.forEach((item: ListItem) => _renderOnItemChanges(item));

      // scheduleRender
      setItems(
        vmRef.current.operationalItems
          .toArray()
          .filter((item: ListItem) => errorsVisible || !item.error),
      );
    }
  }

  useEffect(() => {
    if (props.app.viewLoaded) {
      jsapi
        .load([
          'esri/core/Handles',
          'esri/widgets/LayerList/LayerListViewModel',
          'esri/core/watchUtils',
        ])
        .then(([Handles, LayerListViewModel, watchUtil]) => {
          watchUtilsRef.current = watchUtil;
          handlesRef.current = new Handles();

          vmRef.current = new LayerListViewModel();
          if (handlesRef.current && vmRef.current) {
            handlesRef.current.push(
              watchUtils.on(vmRef.current, 'operationalItems', 'change', _itemsChanged),
            );
            vmRef.current.view = window.agsGlobal.view;
            setItems(
              vmRef.current.operationalItems.toArray().filter(item => errorsVisible || !item.error),
            );
          }
        });
    }

    return () => {
      if (handlesRef.current) {
        handlesRef.current.destroy();
      }
    };
  }, [props.app.viewLoaded, errorsVisible]);

  const vmState = vmRef.current && vmRef.current.state;
  const baseClasses = {
    disabled: vmState === 'disabled',
  };

  return (
    <div className={classes('geomap-widget-layer-list', baseClasses)} style={style}>
      {items.length === 0 ? (
        <div className={'geomap-widget-layer-list__noop'}>没有可以显示的内容</div>
      ) : (
        <ul
          role="listbox"
          className={classes(
            'geomap-widget-layer-list__list',
            'geomap-widget-layer-list__list-root',
            'geomap-widget-layer-list__list-independent',
          )}
        >
          {items.map((item, index) => {
            return (
              <LayerListItem
                widgetId={widgetId}
                item={item}
                parent={null}
                displayIndex={items.length - 1 - index}
                selectionEnabled={selectionEnabled}
                selectedItems={selectedItems}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default connect(({ app }: ConnectState) => {
  return { app };
})(LayerList);
