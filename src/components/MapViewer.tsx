import React, { useEffect, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import _ from 'lodash';
import ViewManager from '@/core/view-manager';
import { JimuMapViewStatus } from '@/core/types/state';
import GeoMapView from '@/core/view/GeoMapView';

export interface ViewRenderFunc {
  (views: { [viewId: string]: GeoMapView }): React.ReactNode;
}

interface MapViewerPropTypes {
  useMapWidgetIds: Array<string>;
  children?: React.ReactNode | ViewRenderFunc;
  viewInfos: {
    [geoMapViewId: string]: object;
  };
}

const MapViewer: React.FC<MapViewerPropTypes> = ({ useMapWidgetIds, viewInfos, children }) => {
  const viewManager = useRef(ViewManager.instance());
  function getActiveViewId() {
    const mapWidgetId = useMapWidgetIds && useMapWidgetIds[0];
    const group = viewManager.current.getGeoMapViewGroup(mapWidgetId);
    const view = group && group.getActiveGeoMapView();
    return (view && view.id) || null;
  }

  function getWhetherViewCreated(viewId, viewInfos) {
    return (
      !viewId ||
      !!(
        viewId &&
        viewInfos &&
        viewInfos[viewId] &&
        viewInfos[viewId].status &&
        viewInfos[viewId].status === JimuMapViewStatus.Loaded
      )
    );
  }

  const [activeViewId, setActiveViewId] = useState(getActiveViewId());
  const [isActiveViewCreated, setActiveViewCreated] = useState(
    getWhetherViewCreated(getActiveViewId(), viewInfos),
  );
  const [areAllViewsCreated, updateAllViewsCreated] = useState<boolean>(false);

  function getViewIdsFromMapWidgetId(id, t) {
    return t
      ? _.keys(t).filter(r => {
          return t[r].mapWidgetId === id;
        })
      : [];
  }

  function getViewIdsFromUseMapWidgetIds(ids, t) {
    let i = [];
    ids.forEach(id => {
      i = i.concat(getViewIdsFromMapWidgetId(ids, t));
    });
    return i;
  }

  useEffectOnce(() => {
    if (areAllViewsCreated) {
    }
  });

  function getViews(ids) {
    if (!ids) return null;
    const t = {};
    ids.forEach(id => {
      t[id] = viewManager.current.getGeoMapViewById(id);
    });
    return t;
  }

  function _render() {
    if (!useMapWidgetIds || !viewInfos || children) {
      return null;
    }
    // const ids =
  }

  return _render();
};

export default MapViewer;
