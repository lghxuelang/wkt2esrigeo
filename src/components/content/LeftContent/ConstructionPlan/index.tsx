import React, { useEffect, useState } from 'react';
import { jsapi, geometryUtils, viewUtils } from '@/utils/arcgis';
import TitlePanel from '@/components/containers/titlePanel';
// 总体计划
import Master from '@/components/content/LeftContent/ConstructionPlan/Master';
// 进度模拟
import Schedule from '@/components/content/LeftContent/ConstructionPlan/Schedule';
import SpaceQuery from './SpaceQuery'

import styles from './index.less';
import dataUrls from './data'

interface LandStasisPropTypes {

}

const cnstrPlan: React.FC<LandStasisPropTypes> = () => {
  const [activeToolbar, setActiveToolbar] = useState('schedule');
  // const [activeToolbar, setActiveToolbar] = useState('master');

  useEffect(() => {
    init()
    return () => {
      destroy()
    }
  }, [])

  const init = async () =>{

    const [FeatureLayer] = await jsapi.load(["esri/layers/FeatureLayer"])
    const layerArr = Object.keys(dataUrls).map(key => {
      const url = dataUrls[key]
      return new FeatureLayer({url});
    });
    const viewmap = await viewUtils.isViewReady()
    viewmap.map.addMany(layerArr)
  }

  const destroy = async function () {
    const viewmap = await viewUtils.isViewReady()
    viewmap.map.removeAll()
  }

  const ContentForTitle = () => {
    switch (activeToolbar) {
      case 'master': {
        return <Master/>;
      }
      case 'schedule': {
        return <Schedule/>;
      }
      case  'spatial': {
        return <SpaceQuery/>;
      }
      default:
        return null;
    }
  };

  const changeToolbarActive = e => {
    setActiveToolbar(e.currentTarget.dataset.btn);
  };

  return (
    <TitlePanel title="建设计划" className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles['guide']}>
          <span
            className={activeToolbar === 'master' ? styles.active : ''}
            data-btn="master"
            onClick={changeToolbarActive}
          >
            总体计划
          </span>
          <span
            className={activeToolbar === 'schedule' ? styles.active : ''}
            data-btn="schedule"
            onClick={changeToolbarActive}
          >
            进度模拟
          </span>
          <span
            className={activeToolbar === 'spatial' ? styles.active : ''}
            data-btn="spatial"
            onClick={changeToolbarActive}>
            空间查询
          </span>
        </div>

        <div className={styles.contentDiv}>
          <ContentForTitle/>
        </div>

      </div>
    </TitlePanel>
  );
};

export default cnstrPlan;
