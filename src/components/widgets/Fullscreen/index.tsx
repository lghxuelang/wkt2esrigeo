/**
 * The FullScreen widget allows users to full screen the map.
 * @author yanwh
 * @date 2020-03-06
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import { AppModelState } from '@/models/app';
import { ConnectState, ConnectProps } from '@/models/connect';
import classes from 'classnames';
import jsapi from '@/utils/arcgis/jsapi';
import FullscreenViewModel = __esri.FullscreenViewModel;
import FullscreenViewModelConstructor = __esri.FullscreenViewModelConstructor;
import watchUtils = __esri.watchUtils;
import WatchHandle = __esri.WatchHandle;

interface IFullScreen extends ConnectProps {
  app: AppModelState;
}

const Fullscreen: React.FC<IFullScreen> = props => {
  const { app } = props;
  const [isFull, setFull] = useState<Boolean>(false);
  const vmRef = useRef<FullscreenViewModel>();
  const watchHandle = useRef<WatchHandle>();

  useEffect(() => {
    if (app.viewLoaded) {
      jsapi
        .load(['esri/widgets/Fullscreen/FullscreenViewModel', 'esri/core/watchUtils'])
        .then(([ViewModel, watchUtil]: [FullscreenViewModelConstructor, watchUtils]) => {
          vmRef.current = new ViewModel({
            view: window.agsGlobal.view,
          });
          watchHandle.current = watchUtil.watch(vmRef.current, 'state', () => {
            if (vmRef.current) {
              setFull(vmRef.current.state === 'active');
            }
          });
        });
    }
  }, [app.viewLoaded]);

  function toggle() {
    if (vmRef.current) {
      vmRef.current.toggle();
    }
  }

  return (
    <div className="geomap-widget-fullscreen" onClick={toggle}>
      <span
        className={classes(
          'geomap-widget-fullscreen__icon',
          isFull ? 'esri-icon-zoom-in-fixed' : 'esri-icon-zoom-out-fixed',
        )}
      />
    </div>
  );
};

export default connect(({ app }: ConnectState) => {
  return { app };
})(Fullscreen);
