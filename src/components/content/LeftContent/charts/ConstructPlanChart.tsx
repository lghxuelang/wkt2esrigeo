import React, { CSSProperties, useEffect, useRef } from 'react';
import enchants from 'echarts';
import themeMgr from './support/themes';

interface ConstructPlanChartPropTypes {
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
        '产业',
        '住宅',
        '公建',
        '基础设施',
        '环境',
      ],
    },
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
          { value: 335, name: '产业' },
          { value: 310, name: '住宅' },
          { value: 234, name: '公建' },
          { value: 135, name: '基础设施' },
          { value: 1548, name: '环境' },
        ],
      },
    ],
  });
}

const ConstructPlanChart: React.FC<ConstructPlanChartPropTypes> = ({
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

export default ConstructPlanChart;
