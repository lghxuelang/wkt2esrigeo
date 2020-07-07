import React, { useState, useRef, useEffect } from 'react';
import { Slider } from 'antd';
import styles from './index.less';
import echarts from 'echarts';
import { jsapi, viewUtils } from '@/utils/arcgis';

function initChart(container: HTMLDivElement) {
  const chart = echarts.init(container);
  let options: echarts.EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      show: false,
    },
    color: ['#4346D3', '#16CEB9', '#6648FF', '#2D99FF', '#20242B'],
    series: [
      {
        name: '项目性质',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 335, name: '国土' },
          { value: 310, name: '管网' },
          { value: 234, name: '水务' },
          { value: 135, name: '气候' },
          { value: 548, name: '污染' },
        ],
      },
    ],
  };
  chart.setOption(options, { notMerge: true });
}

interface SpaceQueryPropTypes {}

const circleDefaultCfg = {
  geodesic: true,
  radiusUnit: 'kilometers',
};
const circleSymbol = {
  type: 'simple-fill', // autocasts as new SimpleFillSymbol()
  color: [255, 255, 255, 0.1],
  style: 'solid',
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [0, 255, 249],
    width: 1,
  },
};
const pointSymbol = {
  type: 'simple-marker',
  color: [0, 255, 249, 1],
};

/**
 * useState的增强版，多返回一个ref用于回调函数的取值
 * @param initValue
 */
const useStateWithRef = initValue => {
  const [innerValue, setInnerValue] = useState(initValue);
  const innerValueRef = useRef(initValue);
  useEffect(() => {
    innerValueRef.current = innerValue;
  }, [innerValue]);

  return [innerValue, setInnerValue, innerValueRef];
};

/**
 * 根据当前变化的值,生成Debounce之后的值
 * https://usehooks.com/useDebounce/
 *
 * @param {*} value 需要debounce处理的值
 * @param {*} delay debounce时间
 */
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

const SpaceQuery: React.FC<SpaceQueryPropTypes> = ({}) => {
  const [searchRange, setSearchRange, searchRangeRef] = useStateWithRef(0.75);
  const _searchRange = useDebounce(searchRange, 300);
  const chartRef: React.Ref<HTMLDivElement | any> = useRef(null);
  const draggingGraphic = useRef<any>(null);
  const tempGraphic = useRef<any>(null);
  const graphicsLayer = useRef<any>(null);
  const cbRef = useRef<any>(null);
  const addGraphicEventHandle = useRef<any>(null);
  const dragEventHandle = useRef<any>(null);

  // 初始化表格
  useEffect(() => {
    let chart = initChart(chartRef.current);
    init();
    return () => {
      dragEventHandle.current && dragEventHandle.current.remove();
      addGraphicEventHandle.current && addGraphicEventHandle.current.remove();
    };
  }, []);

  // debounce  拖动slider 画圈
  useEffect(() => {
    if (!graphicsLayer.current) return;
    const geometry = graphicsLayer.current.graphics.items[0].geometry.center.toJSON();
    graphicsLayer.current.graphics.remove(graphicsLayer.current.graphics.items[0]);
    drawQueryCirlcle(graphicsLayer.current, {
      radius: searchRangeRef.current,
      center: geometry
    });
    // todo 重晒结果
  }, [_searchRange]);

  // 初始化函数
  const init = async () => {
    const viewmap = await viewUtils.isViewReady();
    const [GraphicsLayer, Circle, Graphic] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/geometry/Circle',
      'esri/Graphic',
    ]);

    graphicsLayer.current = new GraphicsLayer({
      id: 'circle_query_data_layer',
      elevationInfo: {
        mode: 'relative-to-scene',
        offset: 99,
      },
    });

    viewmap.map.add(graphicsLayer.current);

    drawQueryCirlcle(graphicsLayer.current, {
      radius: searchRangeRef.current,
    });

    dragEventHandle.current = viewmap.on('drag', function(evt) {
      switch (evt.action) {
        case 'start':
          // 点击测试获取操作graphic对象
          viewmap.hitTest(evt).then(resp => {
            if (resp.results[0].graphic && resp.results[0].graphic.geometry.type === 'polygon') {
              evt.stopPropagation();
              // 缓存拖拽对象
              draggingGraphic.current = resp.results[0].graphic;
            }
          });
          break;
        case 'update':
          if (!draggingGraphic.current) return;
          evt.stopPropagation();
          if (tempGraphic.current) {
            // 拖拽中clone出来的graphic对象是个点，用于更新生成circle的位置
            viewmap.graphics.remove(tempGraphic.current);
          } else {
            // 第一次拖拽移除上一次绘制的cicle
            graphicsLayer.current.remove(draggingGraphic.current);
          }
          // 生成一个点graphic，并根据事件更新位置
          tempGraphic.current = draggingGraphic.current.clone();
          tempGraphic.current.geometry = viewmap.toMap(evt);
          tempGraphic.current.symbol = pointSymbol;
          viewmap.graphics.add(tempGraphic.current);
          break;
        case 'end':
          if (!draggingGraphic.current) return;
          evt.stopPropagation();
          if (tempGraphic.current) viewmap.graphics.remove(tempGraphic.current);

          drawQueryCirlcle(graphicsLayer.current, {
            radius: searchRangeRef.current,
            center: tempGraphic.current.geometry.clone(),
          });

          // 重置辅助变量
          draggingGraphic.current = null;
          tempGraphic.current = null;
          // todo 触发query data
          break;

        default:
          break;
      }
    });

    // addGraphicEventHandle.current = viewmap.map.layers.on("after-add", function(event){
    addGraphicEventHandle.current = graphicsLayer.current.on('layerview-create', function(event) {
      console.log(event, 'after-add');
      cbRef.current && cbRef.current(event);
      cbRef.current = null;
    });
  };

  /** 
   * 在屏幕上画圈
   * @param graphicsLayer
   * @param param1
   */
  const drawQueryCirlcle = async (graphicsLayer, { center = '', radius, ...opts }) => {
    const viewmap = await viewUtils.isViewReady();
    const [Circle, Graphic] = await jsapi.load(['esri/geometry/Circle', 'esri/Graphic']);
    const circle = new Circle({
      ...circleDefaultCfg,
      ...opts,
      center: center || viewmap.center,
      radius: radius,
    });

    var _graphic = new Graphic({
      geometry: circle,
      symbol: circleSymbol,
    });

    // graphicsLayer.add(_graphic);
    addGraphicToLayer(graphicsLayer, _graphic).then(e => {
      console.log(e, 'promise');
    });
  };

  // todo 尝试把给图层添加graphic 返回一个promise
  /**
   * 尝试把给图层添加graphic 返回一个promise
   * @param layer
   * @param graphic
   * @param cb
   */
  const addGraphicToLayer = (layer, graphic, cb = () => {}) => {
    return new Promise((resolve, reject) => {
      // viewmap.map.add(graphicsLayer.current);
      layer.add(graphic);
      cbRef.current = event => {
        console.log('cb');
        resolve(event);
      };
    });
  };

  return (
    <div className={styles.spaceQuery}>
      <div className={styles.progressContianer}>
        <p className={styles.number}>{searchRange * 1000}</p>
        <span className={styles.searchRangeText}>检索范围（{searchRange}km）</span>
        <div className={styles.sliderContainer}>
          <Slider
            min={0}
            max={100}
            defaultValue={searchRange * 100}
            onChange={value => {
              setSearchRange(value / 100);
            }}
          />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartDom} ref={chartRef}></div>
        <div className={styles.typeSwitch}>
          <p>项目类型</p>
          <p>资金来源</p>
          <p className={styles.activeChart}>项目类型</p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.listItem}>
          <span>1</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.constructionState}>实施中</span>
        </div>
        <div className={styles.listItem}>
          <span>2</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.constructionState}>实施中</span>
        </div>
        <div className={styles.listItem}>
          <span>3</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.constructionState}>实施中</span>
        </div>
        <div className={styles.listItem}>
          <span>4</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.planState}>计划中</span>
        </div>
        <div className={styles.listItem}>
          <span>5</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.planState}>计划中</span>
        </div>
        <div className={styles.listItem}>
          <span>6</span>
          <span>生态谷惠风溪桥</span>
          <span className={styles.planState}>计划中</span>
        </div>
      </div>
    </div>
  );
};

export default SpaceQuery;
