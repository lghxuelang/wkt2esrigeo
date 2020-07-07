import React, { useEffect, useState } from 'react';
import { viewUtils, buildingUtils, layerCreator } from '@/utils/arcgis';
import TitlePanel from '@/components/containers/titlePanel';
import DoughnutChart from '@/components/content/LeftContent/charts/Doughnut';
import CustomizedPie from '@/components/content/LeftContent/charts/CustomizedPie';
import PublicTraffic from './PublicTraffic';
import EnergySupply from './EnergySupply/index';
import Environment from './Environment';
import styles from './index.less';
import CityEvents from './CityEvents';

const buildingLayerUrl = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/建筑/SceneServer';
const vectorTLayerUrl1 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E4%B8%AD%E5%BF%83%E7%BA%BF/VectorTileServer';
const vectorTLayerUrl2 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E5%88%86%E7%BA%A7%E5%88%AB%E6%98%BE%E7%A4%BA_%E7%AC%A6%E5%8F%B7%E4%B8%8D%E5%8F%98_20180628/VectorTileServer';
interface optServer {
  type: String,
  url: String,
}
interface CityStatisPropTypes {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  layerArr: Array<optServer>;
}

function toThousands(num: number): string {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

const CityStatis: React.FC<CityStatisPropTypes> = ({ className, style, layerArr }) => {
  const [currentComponents, setCurrentComponents] = useState('cityGeneral');
  useEffect(() => {
    viewUtils.isViewReady().then(async () => {
      // window.agsGlobal.view.map.removeAll();
      layerArr = [
      {type:'SceneLayer',url:buildingLayerUrl},
      {type:'VectorTileLayer',url:vectorTLayerUrl1},
      {type:'VectorTileLayer',url:vectorTLayerUrl2},
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
    // 卸载组件时移出所有图层
    return ()=>{
      if (window.agsGlobal) {
          window.agsGlobal.view.map.removeAll();
      }
    }

  }, []);

  return (
    <>
      {currentComponents === 'cityGeneral' ? <TitlePanel title="城市概况" className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.statis}>
            <div>
              <div className={styles.title}>总面积(平方米)</div>
              <div className={styles.text}>{toThousands(64222)}</div>
            </div>
            <div>
              <div className={styles.title}>人口总数</div>
              <div className={styles.text}>{toThousands(643345)}</div>
            </div>
            <div>
              <div className={styles.title}>下属辖区</div>
              <div className={styles.text}>{toThousands(25)}</div>
            </div>
            <div>
              <div className={styles.title}>建筑总数</div>
              <div className={styles.text}>{toThousands(15632)}</div>
            </div>
            <div>
              <div className={styles.title}>人口密度</div>
              <div className={styles.text}>{toThousands(34.22)}</div>
            </div>
            <div>
              <div className={styles.title}>辖区人口</div>
              <div className={styles.text}>{toThousands(643345)}</div>
            </div>
          </div>
          <div className={styles.btns}>
            <button>居民住宅</button>
            <button className={styles.active}>办公楼</button>
            <button>教育资源</button>
            <button>交通设施</button>
            <button>医疗资源</button>
          </div>
          <div className={styles.charts}>
            <div className={styles.chart}>
              <DoughnutChart data={[{}]} title={'城市事件'} className={styles.container} chartClick={() => {
                // console.log('图表跳转')
                setCurrentComponents('cityEvents');
              }} />
            </div>
            <div className={styles.chart}>
              <CustomizedPie data={[{}]} title={'公共交通'} className={styles.container} chartClick={() => {
                setCurrentComponents('publicTraffic');
              }} />
            </div>
            <div className={styles.chart}>
              <DoughnutChart data={[{}]} title={'生态环境'} className={styles.container} chartClick={() => {
                // console.log('图表跳转')
                setCurrentComponents('environment');
              }} />
            </div>
            <div className={styles.chart}>
              <DoughnutChart data={[{}]} title={'能源运行'} className={styles.container} chartClick={() => {
                // console.log('图表跳转')
                setCurrentComponents('energySupply');
              }} />
            </div>
          </div>
        </div>
      </TitlePanel> : null}
      {currentComponents === 'publicTraffic' ? <PublicTraffic backUp={(currentComponent) => {
        setCurrentComponents(currentComponent)
      }} /> : null}
      {currentComponents === 'environment' ? <Environment backUp={(currentComponent) => {
        setCurrentComponents(currentComponent)
      }} /> : null}
      {currentComponents === 'cityEvents' ? <CityEvents backUp={(currentComponent) => {
        setCurrentComponents(currentComponent)
      }} /> : null}
      {currentComponents === 'energySupply' ?
        <EnergySupply
          backUp={(currentComponent) => {
            setCurrentComponents(currentComponent)
          }}
        /> : null}
    </>


  );
};

export default CityStatis;
