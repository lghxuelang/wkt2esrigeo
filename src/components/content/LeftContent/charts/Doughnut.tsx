import React, { useEffect, useRef } from 'react';
import echarts from 'echarts';
import themeMgr from './support/themes';

interface DoughnutPropTypes {
  data?: object[];
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  title?: string;
  chartClick?: Function
}

function initChart(container: HTMLDivElement, data: object[], title?: string, onClick?: Function) {
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
            show: false,
            position: 'center',
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
            show: false,
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
  if (onClick) {
    chart.on('click', onClick)
  }
}

const DoughnutChart: React.FC<DoughnutPropTypes> = ({ title, data, className, style, chartClick }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && data && data.length > 0) {
      initChart(domRef.current, data, title, chartClick);
    }
  }, [data, title]);

  return <div ref={domRef} className={className} style={style} />;
};

export default DoughnutChart;
