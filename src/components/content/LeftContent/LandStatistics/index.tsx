import React, { useEffect, useState } from 'react';
import TitlePanel from '@/components/containers/titlePanel';
import MasterPlan from './MasterPlan';
import UplandSummary from './UselandSummary';
import { jsapi, viewUtils } from '@/utils/arcgis';
// 控规浏览
import ControlBrowse from '@/components/content/LeftContent/LandStatistics/ControlBrowse';
// 用地平衡
import LandBalance from '@/components/content/LeftContent/LandStatistics/LandBalance';

import styles from './index.less';

interface LandStasisPropTypes {

}

const masterPlanURL = "https://103.233.7.3:8119/arcgis/rest/services/Hosted/总规/FeatureServer"; // 总规
const contralURL = "https://103.233.7.3:8119/arcgis/rest/services/Hosted/控规_地块_201411/FeatureServer"; // 控规
const unitURL = "https://103.233.7.3:8119/arcgis/rest/services/Hosted/规划统计单元_街区/FeatureServer"; // 街区
const LandStasis: React.FC<LandStasisPropTypes> = () => {
  const [activeToolbar, setActiveToolbar] = useState('masterclass');
  useEffect(() => {
    init();

    return ()=>{
      if (window.agsGlobal) {
        let masterLandLayer = window.agsGlobal.view.map.findLayerById('masterLandLayer');
        if (masterLandLayer) {
          window.agsGlobal.view.map.remove(masterLandLayer);
        }
        let streetBlockLayer = window.agsGlobal.view.map.findLayerById('streetBlockLayer');
        if (streetBlockLayer) {
          window.agsGlobal.view.map.remove(streetBlockLayer);
        }
        let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById('masterLandLayer');
        if (controlLandBlockLayer) {
          window.agsGlobal.view.map.remove();
        }
      }
    }
  }, []);

  const init = async () => {
    const [FeatureLayer] = await jsapi.load(["esri/layers/FeatureLayer"])
    const firstLayer = new FeatureLayer({
      id: 'masterLandLayer',
      url: masterPlanURL,
      visible:true,
    });
    const streetBlock = new FeatureLayer({
      id: 'streetBlockLayer',
      url: unitURL,
      visible: false,
    });
    const controlLandBlock = new FeatureLayer({
      id: 'controlLandBlock',
      url: contralURL,
      visible: false,
    });
    const viewmap = await viewUtils.isViewReady()
    viewmap.map.addMany([firstLayer, streetBlock, controlLandBlock]);
  }

  const renderContent = () => {
    switch (activeToolbar) {
      case 'masterclass': {
        return <MasterPlan />;
      }
      case 'userlandSummary': {
        return <UplandSummary />;
      }
      case 'controlBrowse': {
        return <ControlBrowse />;
      }
      case 'loadbalancer': {
        return <LandBalance />;
      }
      default:
        break;
    }
    return <div></div>;
  };

  const changeToolbarActive = e => {
    setActiveToolbar(e.currentTarget.dataset.btn);
  };

  return (
    <TitlePanel title="土地地块" className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles['guide']}>
          <span
            className={activeToolbar === 'masterclass' ? styles.active : ''}
            data-btn="masterclass"
            onClick={changeToolbarActive}
          >
            总体规划
          </span>
          <span
            className={activeToolbar === 'userlandSummary' ? styles.active : ''}
            data-btn="userlandSummary"
            onClick={changeToolbarActive}
          >
            用地汇总
          </span>
          <span
            className={activeToolbar === 'controlBrowse' ? styles.active : ''}
            data-btn="controlBrowse"
            onClick={changeToolbarActive}>
            控规浏览
          </span>
          <span
            className={activeToolbar === 'loadbalancer' ? styles.active : ''}
            data-btn="loadbalancer"
            onClick={changeToolbarActive}>
            用地平衡
          </span>
        </div>
        <div className={styles.contentDiv}>{renderContent()}</div>

      </div>
    </TitlePanel>
  );
};

export default LandStasis;
