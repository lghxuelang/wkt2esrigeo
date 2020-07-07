import React, { CSSProperties, useEffect, useRef } from 'react';
import echarts from 'echarts';
import themeMgr from './support/themes';

interface CityEventsPiePropTypes {
  data?: object[];
  className?: string;
  style?: CSSProperties;
  title?: string;
}

function initChart(container: HTMLDivElement, data: object[], title?: string) {
  const chart = echarts.init(container);
  chart.setOption({
    color: themeMgr.getThemeColor(),
    legend: {
      show: false,
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
    },
    title: {
      text: title,
      show: true,
      left: 'center',
      bottom: 0,
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: '来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'outside',
            color: 'white',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: true,
          },
          lineStyle: {
            color: 'white',
          },
        },
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' },
        ],
      },
    ],
  });
}

const CityEventsPie: React.FC<CityEventsPiePropTypes> = ({ data, title, className, style }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && data && data.length > 0) {
      initChart(domRef.current, data, title);
    }
  }, [data, title]);

  return <div ref={domRef} className={className} style={style} />;
};

export default CityEventsPie;
