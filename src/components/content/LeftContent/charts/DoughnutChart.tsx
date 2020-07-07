import React, { CSSProperties, useEffect, useRef } from 'react';
import enchants from 'echarts';
import themeMgr from './support/themes';

interface DoughnutChartChartPropTypes {
  data?: object[];
  className?: string;
  style?: CSSProperties;
  title?: string;
}

function initChart(container: HTMLDivElement, data: object[], title?: string) {
  const chart = enchants.init(container);
  chart.setOption({
    color: themeMgr.getThemeColor(),
    legend: {
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
      data: [
        'H1城乡居民点建设用地',
        'H2城乡居民点建设用地',
        'H3城乡居民点建设用地',
        'H4特殊用地',
        'H5采矿用地',
        'H9其他建设用地',
        'E1农林用地',
        'E2水域',
        'E9其他建设用地',
      ],
    },
    title: {
      text: '1053',
      show: true,
      left: '23%',
      bottom: '45%',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    },
    series: [
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
        data: [
          { value: 335, name: 'H1城乡居民点建设用地' },
          { value: 310, name: 'H2城乡居民点建设用地' },
          { value: 234, name: 'H3城乡居民点建设用地' },
          { value: 135, name: 'H4特殊用地' },
          { value: 1548, name: 'H5采矿用地' },
          { value: 310, name: 'H9其他建设用地' },
          { value: 234, name: 'E1农林用地' },
          { value: 135, name: 'E2水域' },
          { value: 1548, name: 'E9其他建设用地' },
        ],
      },
    ],
  });
}

const DoughnutChart: React.FC<DoughnutChartChartPropTypes> = ({
                                                                 data,
                                                                 title,
                                                                 className,
                                                                 style,
                                                               }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && data && data.length > 0) {
      initChart(domRef.current, data, title);
    }
  }, [data, title]);

  return <div ref={domRef} className={className} style={style}/>;
};

export default DoughnutChart;
