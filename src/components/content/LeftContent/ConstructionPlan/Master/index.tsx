import React, { useEffect, useRef, useState } from 'react';
import { Select, message } from 'antd';
import styles from './index.less';
// import ConstructPlanChart from '@/components/content/LeftContent/charts/ConstructPlanChart';
import EchartWrap from '../EchartWrap';
import themeMgr from '../../charts/support/themes';
import dataUrls from '../data';
import { queryData, getColorByType } from '../helper';
import { pointsRenderer } from '../styleCfg';
import { jsapi, geometryUtils, viewUtils } from '@/utils/arcgis';

const { Option } = Select;

interface MasterPropTypes {}

// 可以重用的echarts配置
const title = {
  text: '1053',
  show: false,
  left: '23%',
  bottom: '45%',
  textStyle: {
    color: 'white',
    fontSize: 18,
  },
}
const _legend = JSON.stringify({
  show: true,
  type: 'scroll',
  orient: 'vertical',
  textStyle: {
    fontSize: 12,
    color: 'rgba(255,255,255,1)',
  },
  right: 10,
  top: 20,
  bottom: 20,
  data: ['产业', '住宅', '公建', '基础设施', '环境'],
});
const _series = JSON.stringify([
  {
    name: '来源',
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['30%', '50%'],
    avoidLabelOverlap: false,
    label: {
      normal: {
        show: false,
        position: 'center',
      },
      emphasis: {
        show: true,
        textStyle: {
          fontSize: '12',
          fontWeight: 'bold',
        },
      },
    },
    labelLine: {
      normal: {
        show: false,
      },
    },
    data: [],
  },
]);

// 初始化图表配置
const initSeries = JSON.parse(_series);
initSeries[0].data = [
  { value: 1, name: '产业' },
  { value: 1, name: '住宅' },
  { value: 1, name: '公建' },
  { value: 1, name: '基础设施' },
  { value: 1, name: '环境' },
];
const initLegend = JSON.parse(_legend);
const options = {
  title,
  color: getColorByType(initLegend.data),
  legend: initLegend,
  series: initSeries,
};

/**
 * 建筑设置第一屏模块
 * @param props
 */
const Master: React.FC<MasterPropTypes> = () => {
  const [curUrl, setCurUrl] = useState(dataUrls[2016]);
  const [optionData, setOptionData] = useState<any>(options);
  const resultArrByProjType = useRef<any | null>(null);
  const [dataForChart, setDataForChart] = useState<any[]>([]);
  const [seriesArr, setSeriesArr] = useState<any[]>([]);
  const [eventFns, setEventFns] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const curPointLayer = useRef<any>(null);

  // 根据下拉框获取chart与列表数据
  useEffect(() => {
    setIsLoading(true);
    queryData(curUrl).then(data => {
      const resultObj = {};
      const projectTypeArr: string[] = [];
      let nameArr: string[] = [];

      data.features.forEach(item => {
        let projectType = item.attributes.xmlx;
        if (projectType === ' ') {
          // 数据为空的做下处理
          item.attributes.xmlx = '未分类';
          projectType = '未分类';
        }
        if (projectTypeArr.indexOf(projectType) === -1) {
          projectTypeArr.push(projectType);
          resultObj[projectType] = [];
        }
        nameArr.push(item.attributes.xmmc);

        resultObj[projectType].push(item);
      });
      resultArrByProjType.current = resultObj;
      setDataForChart(
        projectTypeArr.map(type => {
          return { value: resultObj[type].length, name: type };
        }),
      );

      setSeriesArr(projectTypeArr);
      setIsLoading(false);
    });
  }, [curUrl]);

  // 根据新数据渲染chart图标
  useEffect(() => {
    const series = JSON.parse(_series);
    series[0].data = dataForChart;

    const legend = JSON.parse(_legend);
    legend.data = dataForChart.map(e => e?.name);
    const color = getColorByType(legend.data);
    setOptionData({
      color,
      legend,
      title: {
        text: '1053',
        show: false,
        left: '23%',
        bottom: '45%',
        textStyle: {
          color: 'white',
          fontSize: 18,
        },
      },
      series,
    });

    setEventFns({
      click: (...rest) => console.log(rest),
      legendselectchanged: legend => {
        // 运用stateFn
        setSeriesArr(preArr => {
          const index = preArr.indexOf(legend.name);
          if (index === -1) {
            return [...preArr, legend.name];
          } else {
            const result = preArr.slice();
            result.splice(index, 1);
            return result;
          }
        });
      },
    });
  }, [dataForChart]);

  // 根据图表中点类型的选择，渲染地图中的点位
  useEffect(() => {
    const where = seriesArr.reduce((result, serie, i, arr) => {
      result += `xmlx='${serie}'`;
      if (arr.length !== 1 && arr.length !== i + 1) {
        result += ' or ';
      }
      return result;
    }, '');
    renderPoint(curUrl, where);
  }, [seriesArr]);

  // 渲染点图层
  const renderPoint = async (url, where) => {
    const view = await viewUtils.isViewReady();
    if (curPointLayer.current) {
      view.map.remove(curPointLayer.current);
    }
    if (!where) return;
    const [FeatureLayer, Legend] = await jsapi.load([
      'esri/layers/FeatureLayer',
      'esri/widgets/Legend',
    ]);
    const pointsLayer = new FeatureLayer({
      url,
      title: 'point Layer',
      elevationInfo: {
        // elevation mode that will place points on top of the buildings or other SceneLayer 3D objects
        mode: 'relative-to-scene',
      },
      renderer: pointsRenderer,
      outFields: ['*'],
      definitionExpression: where,
      // feature reduction is set to selection because our scene contains too many points and they overlap
      featureReduction: {
        type: 'selection',
      },
      labelingInfo: [
        {
          labelExpressionInfo: {
            value: '{xmmc}',
          },
          symbol: {
            type: 'label-3d', // autocasts as new LabelSymbol3D()
            symbolLayers: [
              {
                type: 'text', // autocasts as new TextSymbol3DLayer()
                material: {
                  color: 'white',
                },
                // we set a halo on the font to make the labels more visible with any kind of background
                halo: {
                  size: 1,
                  color: [50, 50, 50],
                },
                size: 10,
              },
            ],
          },
        },
      ],
    });

    curPointLayer.current = pointsLayer;
    view.map.add(pointsLayer);
  };

  const init = async function() {
    const [FeatureLayer, Legend] = await jsapi.load([
      'esri/layers/FeatureLayer',
      'esri/widgets/Legend',
    ]);
  };

  // 点击跳转
  const handleItemClick = async item => {
    if (!item.geometry) {
      message.warn(item.attributes.xmmc + '地理数据尚未上传');
      return;
    }
    const view = await viewUtils.isViewReady();
    view.goTo(item.geometry);
  };

  return (
    <div className={` ${styles.masterPanel}`}>
      <div className={styles['chartDiv']}>
        <EchartWrap option={optionData} style={{ width: 260, height: 180 }} onEvents={eventFns} />

        <Select value={curUrl} onChange={setCurUrl} style={{ width: 74 }} disabled={isLoading}>
          {Object.keys(dataUrls).map(key => {
            return (
              <Option key={key} value={dataUrls[key]}>
                {key}
              </Option>
            );
          })}
        </Select>
      </div>
      {/* 列表头 */}
      <ul className={styles.list}>
        <li className={styles.listItem} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
          <span className={styles.itemTitle}>项目名称</span>
          <span>开始时间</span>
          <span>结束时间</span>
        </li>
      </ul>

      {/* 列表内容 */}
      <ul className={styles.list}>
        {!!seriesArr &&
          seriesArr
            .reduce((result, projType) => {
              if (resultArrByProjType.current[projType]) {
                result = result.concat(resultArrByProjType.current[projType]);
              }
              return result;
            }, [])
            .map((item: any) => {
              return (
                <li
                  className={styles.listItem}
                  onClick={() => handleItemClick(item)}
                  key={item.attributes.xmmc || ''}
                >
                  <span className={styles.itemTitle} title={item.attributes.xmmc || ''}>
                    {item.attributes.xmmc || ''}
                  </span>
                  <span>{item.attributes.jhkgsj || '-'}</span>
                  <span>{item.attributes.jhjgsj || '-'}</span>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default Master;
