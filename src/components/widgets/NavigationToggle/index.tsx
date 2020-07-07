import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { jsapi, viewUtils } from '@/utils/arcgis';
import classnames from 'classnames';
import { Spin } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';
import { AppModelState } from '@/models/app';
import './index.less';


interface INavigationToggle extends ConnectProps {
  app: AppModelState;
}

const NavigationToggle: React.FC<INavigationToggle> = (props) => {
  const { app } = props;
  const [loading, setLoading] = useState<Boolean>(true);
  const [span, setSpan] = useState<Boolean>(true);
  const vmRef = useRef<any>();

  useEffect(() => {
    viewUtils.isViewReady().then(() => {
      setLoading(false);
    });
    jsapi
      .load(['esri/widgets/NavigationToggle/NavigationToggleViewModel'])
      .then(([NavigationToggleViewModel]) => {
        vmRef.current = new NavigationToggleViewModel({
          view: window.agsGlobal.view,
        });
      });
  }, [app.viewLoaded]);
  const mapPanRotate = () => {
    setSpan(!span);
    if (vmRef.current) {
      vmRef.current.toggle();
    }
  };
  return (
    <div
      className={classnames({
        'geomap-widget-navigationtoggle': true,
        disabled: loading,
        'geomap-widget-navigationtoggle_button-pan': span ? true : false,
        'geomap-widget-navigationtoggle_button-rotate': !span ? true : false,
      })}
      onClick={mapPanRotate}
      title={span ? '平移' : '旋转'}
      style={{ opacity: span ? 1 : 0.7 }}
    >
      {loading ? <Spin size='small' /> : null}
    </div>
  );
};
export default connect(({ app }: ConnectState) => {
  return { app };
})(NavigationToggle);
