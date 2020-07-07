import React, { CSSProperties, useEffect, useRef } from 'react';
import enchants from 'echarts';
import themeMgr from './support/themes';

interface LandBalancePieChartPropTypes {
  dataset?: [string, number][]; // 饼图1的dataset.source值
  dataset1?: [string, number][]; // 饼图2的dataset.source值
  className?: string;
  style?: CSSProperties;
  titles?: string[];
}

function initChart(container: HTMLDivElement, data: [string, number][], data1: [string, number][], titles: string[], legendSelectChanged?: Function, pieSelectChanged?: Function) {
  const chart = enchants.init(container);
  let options: enchants.EChartOption = {
    color: themeMgr.getThemeColor(),
    legend: {
      show: false,
    },
    title: [{
      text: titles[0],
      show: true,
      left: '15%',
      bottom: '40%',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    }, {
      text: titles[1],
      show: true,
      left: '65%',
      bottom: '45%',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    }],
    dataset: [{
      source: data
    }, {
      source: data1
    }],
    series: [
      {
        name: '来源',
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        selectedMode: 'single',
        datasetIndex: 0,
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
      },
      {
        name: '来源2',
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['75%', '50%'],
        avoidLabelOverlap: false,
        selectedMode: 'single',
        datasetIndex: 1,
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
      }
    ],
  };
  chart.setOption(options, true);
}

const LandBalancePieChart: React.FC<LandBalancePieChartPropTypes> = ({
  dataset,
  dataset1,
  titles,
  className,
  style,
}) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && dataset && dataset.length > 0 && dataset1 && dataset1.length > 0, titles) {
      if (domRef.current&&dataset&&dataset1) {
        initChart(domRef.current, dataset, dataset1, titles);
      }
    }
  }, [dataset]);

  return <div ref={domRef} className={className} style={style} />;
};

export default LandBalancePieChart;
