/**
 *  The slice widget is a 3D analysis tool that can be used to reveal occluded content in
 *  a {@link* module:esri/views/SceneView}. The slice widget can be applied to any layer type, making it possible
 * to see inside buildings or to explore geological surfaces.
 * @author Joker-lee
 * @date 2020-04-23
 */

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { jsapi } from '@/utils/arcgis/index';
import styles from './index.less';
import { ConnectProps, ConnectState } from '@/models/connect';
import WidgetPanel from '@/components/containers/widgetPanel';

interface MapToolbarPropTypes extends ConnectProps {
  onClose: Function;
}

const LineOfSight: React.FC<MapToolbarPropTypes> = props => {
  const domRef: React.RefObject<HTMLInputElement> = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const { onClose } = props;
  const lineOfSight = useRef<any>();

  useEffect(() => {
    creatWidget(window.agsGlobal.view);
    return () => {
      // 组件卸载时需要将组件destroy
      lineOfSight.current.destroy()
    };
    async function creatWidget(view) {
      const newDiv = document.createElement('div');
      const [LineOfSight] = await jsapi.load(['esri/widgets/LineOfSight']);
      lineOfSight.current = new LineOfSight({
        view: view,
        container: newDiv,
      });
      setLoading(false);
      if (domRef.current) {
        domRef.current.appendChild(newDiv);
      }
    }
  }, []);

  return (
    <WidgetPanel title={'视线分析'} onClose={onClose}>
      <div>
        <div ref={domRef}/>
        {loading && (
          <div className={styles['loading']}>
            <Spin
              size="large"
              spinning={loading}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin/>}
            />
          </div>
        )}</div>

    </WidgetPanel>
  );
};

export  default  LineOfSight;
