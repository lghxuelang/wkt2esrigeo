/**
 * The Zoom widget allows users to zoom in/out within a view.
 * @author Joker-lee
 * @date 2020-03-06
 */

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
// 引入arcgis 工具类库
import { jsapi } from '@/utils/arcgis';
// 引入model
import { AppModelState } from '@/models/app';
import { ConnectState, ConnectProps } from '@/models/connect';
// 引入样式和图片
import './index.less';
import line from './images/line.png';
import add from './images/plus.png';

interface IZoom extends ConnectProps {
  app: AppModelState;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}
const Zoom: React.FC<IZoom> = props => {
  const { app, style } = props;

  const [loading, setLoading] = useState(true);
  const vmRef = useRef<any>();

  useEffect(() => {
    if (app.viewLoaded) {
      jsapi.load(['esri/widgets/Zoom/ZoomViewModel']).then(([ViewModel]: [any]) => {
        vmRef.current = new ViewModel({
          view: window.agsGlobal.view,
        });
        setLoading(false);
      });
    }
  }, [app.viewLoaded]);

  function handleZoomIn() {
    if (!vmRef.current || vmRef.current.state !== 'ready') {
      return;
    }

    if (vmRef.current.canZoomIn) {
      vmRef.current.zoomIn();
    }
  }

  function handleZoomOut() {
    if (!vmRef.current || vmRef.current.state !== 'ready') {
      return;
    }

    if (vmRef.current.canZoomOut) {
      vmRef.current.zoomOut();
    }
  }

  return (
    <div className="geomap-widget-zoom" style={style}>
      <span
        className={classnames('geomap-widget-zoom__button', {
          disabled: loading,
        })}
        onClick={handleZoomIn}
        title="放大"
      >
        {loading ? (
          <LoadingOutlined />
        ) : (
          <img className="geomap-widget-zoom__add" src={add} alt="" />
        )}
      </span>
      <span className="geomap-widget-zoom__middleLine"></span>
      <span
        className={classnames('geomap-widget-zoom__button', {
          disabled: loading,
        })}
        onClick={handleZoomOut}
        title="缩小"
      >
        {loading ? (
          <LoadingOutlined />
        ) : (
          <img className="geomap-widget-zoom__line" src={line} alt="" />
        )}
      </span>
    </div>
  );
};

export default connect(({ app }: ConnectState) => {
  return { app };
})(Zoom);
