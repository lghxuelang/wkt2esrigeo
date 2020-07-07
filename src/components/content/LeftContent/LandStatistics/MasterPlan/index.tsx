import React, { useEffect, useState } from 'react';
import { Slider, Switch } from 'antd';
import styles from './index.less';

interface MasterPlanPropTypes {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

const masterLandLayerId = 'masterLandLayer'; // '总规'图层ID

const MasterPlan: React.FC<MasterPlanPropTypes> = ({ className, style }) => {
  const [opacityValue, setOpacityValue] = useState(100);
  const [elevationInfoOffset, setElevationInfoOffset] = useState(0);

  // 设置总规图层可见
  useEffect(() => {
    if (window.agsGlobal) {
      let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId);
      if (controlLandBlockLayer) {
        controlLandBlockLayer.visible = true;
      }
    }
    return () => {
      if (window.agsGlobal) {
        let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId);
        if (controlLandBlockLayer) {
          controlLandBlockLayer.visible = false;
        }
      }
    };
  }, []);


  function opacityValueOnChange(value) {
    setOpacityValue(value);
    if (window.agsGlobal) {
      let masterLandLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId);
      masterLandLayer.opacity = value / 100;
    }
  }

  function elevationInfoOffsetOnChange(value) {
    setElevationInfoOffset(value);
    if (window.agsGlobal) {
      let masterLandLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId);
      if (value === 0) {
        masterLandLayer.elevationInfo = {
          mode: "on-the-ground",
        };
      } else {
        masterLandLayer.elevationInfo = {
          mode: "relative-to-ground",
          offset: value,
          unit: "meters"
        };
      }
    }


  }

  return (
    <div className={styles['wapper']}>
      <div className={styles['description']}>
        <span>
          确定城市性质和发展方向,划定城市规划区范围;确定城市园林绿地系统的发展目标及总体布局;确定城市环境保护目标,提出防治污染措施;进行综合技术经济论证,提出规划实施步骤、措施和方法等
        </span>
        <span>土地利用现状分析;土地利用结构和布局调整;拟定实施规划的政策措施;编制规划供选方案</span>
        <span>
          把全国各个地区的区域规划联系起来,向整体化发展;把区域规划与制订区域开发政策结合起来,通过区域规划为制订某些区域性的具体开发政策提供依据;在多区域进行区域规划
        </span>
        <span>现场踏勘调查;访谈和座谈会调查;文献资料的运用</span>
      </div>

      <div className={styles['divide']}></div>

      <div className={styles['sliderDiv']}>
        <div className={styles['title']}>
          <span>透明度</span>
          <span>{opacityValue}</span>
        </div>
        <Slider defaultValue={opacityValue} value={opacityValue} onChange={opacityValueOnChange} />
      </div>

      <div className={styles['sliderDiv']}>
        <div className={styles['title']}>
          <span>离地高</span>
          <span>{elevationInfoOffset}</span>
        </div>
        <Slider max={1000} defaultValue={elevationInfoOffset} onChange={elevationInfoOffsetOnChange} />
      </div>

    </div>
  );
};

export default MasterPlan;
