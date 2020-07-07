import React, { useEffect, useState } from 'react';
import { Slider, Switch } from 'antd';
import styles from './index.less';
import LandBalancePieChart from '@/components/content/LeftContent/charts/LandBalancePieChart';
import drawOnImg from './images/drawOn.png';
import drawOffImg from './images/drawOff.png';
import FeatureLayer from "esri/layers/FeatureLayer";
import { jsapi, viewUtils } from '@/utils/arcgis';

const controlLandBlockLayerId = 'controlLandBlock'; // 控规_地块_201411
const landBalanceDrawGraphicsLayerId = 'landBalanceDrawGraphicsLayer'; // 绘制图层id
interface UplandSummaryPropTypes {
}


interface LandStatisticItem {
  type: string;
  typeCode: string;
  landCode?: string;
  area: number; // 平方米
  percenter: string;
}


const LandBalance: React.FC<UplandSummaryPropTypes> = () => {
  const [listData, setListData] = useState<LandStatisticItem[]>([]);
  const [chartData, setChartData] = useState<[string, number][]>();
  const [conditionGeometry, setConditionGeometry] = useState();
  const [drawToolActive, setDrawToolActive] = useState<boolean>(false);

  // 设置控规_地块_201411图层可见
  useEffect(() => {
    if (window.agsGlobal) {
      let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(controlLandBlockLayerId);
      controlLandBlockLayer.visible = true;
    }
    return () => {
      if (window.agsGlobal) {
        let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(controlLandBlockLayerId);
        if (controlLandBlockLayer) {
          controlLandBlockLayer.visible = false;
        }
      }
    };
  }, []);

  // 移除绘制图层
  useEffect(() => {
    return () => {
      if (window.agsGlobal) {
        let landBalanceDrawGraphicsLayer = window.agsGlobal.view.map.findLayerById(landBalanceDrawGraphicsLayerId);
        window.agsGlobal.view.map.remove(landBalanceDrawGraphicsLayer);
      }
    }
  }, []);


  useEffect(() => {
    getControlLandBlockStatistic(conditionGeometry).then((data) => {
      if (conditionGeometry) {
        let tableData = data[1] as LandStatisticItem[];
        setListData(tableData);
        let chartData = data[0] as [string, number][];
        setChartData(chartData);
      }
    });
  }, [conditionGeometry]);


  // 获取“控规_地块_201411”图层统计信息
  const getControlLandBlockStatistic = async (geometry) => {
    const mapView = await viewUtils.isViewReady();
    let controlLandBlockLayer = mapView.map.findLayerById(controlLandBlockLayerId) as FeatureLayer;
    const [StatisticDefinition] = await jsapi.load(["esri/tasks/support/StatisticDefinition"]);
    var query = controlLandBlockLayer.createQuery();
    let statisticDefinition = new StatisticDefinition({
      onStatisticField: "shape_leng",
      outStatisticFieldName: "totalArea",
      statisticType: "sum"
    });
    query.geometry = geometry;
    query.outStatistics = [statisticDefinition];
    query.groupByFieldsForStatistics = ["ydxz", "ydxzbm"];
    query.start = 0;
    query.num = 1000000;
    let result = await controlLandBlockLayer.queryFeatures(query);
    let features = result.features;
    let chartData: [string, number][] = [];
    let allCount = 0;
    let tableData: LandStatisticItem[] = [];
    for (let i = 0, len = features.length; i < len; i++) {
      let attributes = features[i].attributes;
      let name: string = attributes.ydxz;
      let nameCode: string = attributes.ydxzbm;
      let count: number = attributes.totalArea
      chartData.push([name, count])
      tableData.push({
        type: name,
        typeCode: nameCode,
        area: Number(count.toFixed(2)),
        percenter: '0%'
      })
      allCount += count;
    }

    // 计算百分比
    for (let j = 0, len = tableData.length; j < len; j++) {
      tableData[j].percenter = (tableData[j].area / allCount * 100).toFixed(1) + '%';
    }
    return [chartData, tableData];
  }

  const initSketch = async () => {
    const [SketchViewModel, GraphicsLayer] = await jsapi.load(["esri/widgets/Sketch/SketchViewModel", "esri/layers/GraphicsLayer"]);
    let mapView = await viewUtils.isViewReady();
    let landBalanceDrawGraphicsLayer = mapView.map.findLayerById(landBalanceDrawGraphicsLayerId);
    if (!landBalanceDrawGraphicsLayer) {
      landBalanceDrawGraphicsLayer = new GraphicsLayer({
        id: landBalanceDrawGraphicsLayerId,
      });
      mapView.map.add(landBalanceDrawGraphicsLayer);
    } else {
      landBalanceDrawGraphicsLayer.removeAll()
    }
    let sketchViewModel = new SketchViewModel({
      layer: landBalanceDrawGraphicsLayer,
      view: mapView,
      updateOnGraphicClick: false,
      polygonSymbol: {
        type: "simple-fill",
        color: [51, 51, 204, 0.1],
        style: "solid",
        outline: {
          color: "red",
          width: 1
        }
      }
    });

    sketchViewModel.create('polygon', { mode: 'click' });
    sketchViewModel.on('create', function (e) {
      if (e.state === 'complete') {
        let conditionGeometry = e.graphic.geometry;
        setConditionGeometry(conditionGeometry);
        setDrawToolActive(false);
      }
    });
  }


  return (
    <div className={styles['landBalance']}>
      <div className={styles.resultContainer}>
        <div className={styles['chartDiv']}>
          {chartData ? <LandBalancePieChart
            dataset={chartData}
            dataset1={chartData}
            titles={['总体用地', '居住用地']}
            style={{
              margin: '0 auto',
              height: '160px',
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          /> : null}
        </div>

        <div className={styles.tableContainer}>
          {listData.map((item) => {
            return (
              <div className={styles.item}>
                <span>{item.type}</span>
                <span>{item.area}</span>
                <span>{item.percenter}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.drawToolContainer}>
        <span className={styles.tip}>请在地图场景内绘制分析区域</span>
        <span className={styles.drawTool} onClick={() => {
          initSketch().then(() => {
            setDrawToolActive(true);
          });
        }}>
          {drawToolActive ? <>  <span className={styles.activeToolTip}>已激活</span></> : <><img className={styles.drawOffImg} src={drawOffImg} alt='' /><span className={styles.drawtip}>点击按钮激活绘制</span></>}
        </span>
      </div>
    </div>
  );
};

export default LandBalance;
