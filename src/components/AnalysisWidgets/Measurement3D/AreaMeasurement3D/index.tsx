/**
 * 三维面积测量
 * @author wangxd
 */

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { jsapi, viewUtils } from '@/utils/arcgis/index';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';

interface MapToolbarPropTypes extends ConnectProps {
  maptoolbar: MaptoolbarModelState;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}
const MeasureArea3D: React.FC<MapToolbarPropTypes> = props => {
  const domRef: React.RefObject<HTMLInputElement> = useRef<any>(null)
  const [loading, setLoading] = useState(true);
  const measrueArea = useRef<any>();

  useEffect(() => {
    creatWidget(window.agsGlobal.view);
    return () => {
      // 组件卸载时需要将组件destroy
      measrueArea.current.destroy()
    };
    async function creatWidget(view) {
      const newDiv = document.createElement('div');
      const [AreaMeasurement3D] = await jsapi.load(['esri/widgets/AreaMeasurement3D']);
      measrueArea.current = new AreaMeasurement3D({
        view: view,
        container: newDiv,
      });
      setLoading(false);
      if (domRef.current) {
        domRef.current.appendChild(newDiv);
      }
      changeAreaUnit(view);
    }
  }, []);

  /**
   * 修改测量微件默认单位
   */
  function changeAreaUnit(view) {
    const interval4areaMeasureUnit = setInterval(() => {
      if (view.activeTool) {
        // console.log(view.activeTool)
        view.activeTool.unit = 'square-meters';
        clearInterval(interval4areaMeasureUnit);
      }
    }, 10);
    const interval4areaMeasurePanel = setInterval(() => {
      if (document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')) {
        if (
          document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')
            .length > 0
        ) {
          clearInterval(interval4areaMeasurePanel);
          const dom = document.getElementsByClassName(
            'esri-area-measurement-3d__units-select esri-select',
          );
          const ops:any = dom[0];
          if (ops) {
            if (ops.length > 0) {
              for (let i = 0; i < ops.length; i += 1) {
                const tempValue = ops[i].value;
                if (tempValue === 'square-meters') {
                  ops[i].selected = true;
                }
              }
            }
          }
        }
      }
    }, 10);
  }

  return (
    <div>
      <div ref={domRef} />
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '30px 50px',
            margin: '20px 0',
          }}
        >
          <Spin
            size="large"
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        </div>
      )}
    </div>
  );
};

export default connect(({ maptoolbar }: ConnectState) => {
  return {
    maptoolbar,
  };
})(MeasureArea3D);
