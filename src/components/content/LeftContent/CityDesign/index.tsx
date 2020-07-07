import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import TitlePanel from '@/components/containers/titlePanel';
import styles from './index.less';
import LandSpace from './components/LandSpace';
import UnderPipeline from './components/UnderPipeline';
import { ConnectProps, ConnectState } from '@/models/connect';
import { viewUtils, buildingUtils, layerCreator } from '@/utils/arcgis';
import { ToolbarModelState } from '@/models/toolbar';

const buildingLayerUrl = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/建筑/SceneServer';
const vectorTLayerUrl1 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E4%B8%AD%E5%BF%83%E7%BA%BF/VectorTileServer';
const vectorTLayerUrl2 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E5%88%86%E7%BA%A7%E5%88%AB%E6%98%BE%E7%A4%BA_%E7%AC%A6%E5%8F%B7%E4%B8%8D%E5%8F%98_20180628/VectorTileServer';
const featurePOI='https://103.233.7.3:8119/arcgis/rest/services/Hosted/POI/FeatureServer';
// 公交站点：
const featureBusStop= 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E5%85%AC%E4%BA%A4%E7%AB%99%E7%82%B9_gdb/FeatureServer';
// 小区详细概况：
const featureCommunity = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E5%B0%8F%E5%8C%BA%E8%AF%A6%E7%BB%86%E6%A6%82%E5%86%B5/FeatureServer';


interface optServer {
  type: String,
  url: String,
}

interface CityDesignPropTypes extends ConnectProps {
  layerArr: Array<optServer>;
  dispatch: Dispatch;
}

const CityDesign: React.FC<CityDesignPropTypes> = (props) => {
  const [activeToolbar, setActiveToolbar] = useState('landspace');
  let { layerArr, dispatch } = props;
  // 初始化当前组件需要加载的底图
  useEffect(() => {
    viewUtils.isViewReady().then(async () => {
      // window.agsGlobal.view.map.removeAll();
      layerArr = [
      {type:'SceneLayer',url:buildingLayerUrl},
      {type:'VectorTileLayer',url:vectorTLayerUrl1},
      {type:'VectorTileLayer',url:vectorTLayerUrl2},
      {type:'Feature Service',url:featurePOI},
      {type:'Feature Service',url:featureBusStop},
      {type:'Feature Service',url:featureCommunity},
    ]
      for( let i: number = 0; i < layerArr.length; i++ ){
        const opt = {
          type: layerArr[i].type,
          title: layerArr[i].type + i.toString(),
          url: layerArr[i].url,
        };
        if (window.agsGlobal) {
          buildingUtils.add(window.agsGlobal.view, opt);
        }
      }
    });
    dispatch({
      type: 'toolbar/queryLayerClassify',
    });
    // 卸载组件时移出所有图层
    return ()=>{
      if (window.agsGlobal) {
          window.agsGlobal.view.map.removeAll();
      }
    }

  }, []);

  const underPipelineData = {
    yAxis: { data: ['中水', '天然气', '气力', '污水', '热水', '煤气', '电信', '路灯', '输配水管', '雨水', '广播'] },
    series: [{
      name: '管点',
      data: [47, 78, 34, 121, 68, 158, 32, 184, 40, 41, 41],
    }, {
      name: "管线",
      data: [10, 38, 14, 51, 38, 68, 22, 74, 20, 22, 31],
    }]
  };

  const renderContent = () => {
    switch (activeToolbar) {
      case 'landspace': {
        return <LandSpace />;
      }
      case 'underPipeline': {
        return <UnderPipeline data={underPipelineData} />;
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
    <TitlePanel title="城市规划" className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles['guide']}>
          <span
            className={activeToolbar === 'landspace' ? styles.active : ''}
            data-btn="landspace"
            onClick={changeToolbarActive}
          >
            地上空间
          </span>
          <span
            className={activeToolbar === 'underPipeline' ? styles.active : ''}
            data-btn="underPipeline"
            onClick={changeToolbarActive}
          >
            地下管线
          </span>
        </div>

        <div className={styles.contentDiv}>{renderContent()}</div>

      </div>
    </TitlePanel>
  );
};

// export default CityDesign;
export default connect(({toolbar}: ConnectState) => {
  return {
    toolbar,
  };
})(CityDesign);