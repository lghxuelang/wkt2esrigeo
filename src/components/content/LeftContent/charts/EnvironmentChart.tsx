import React, { CSSProperties, useEffect, useRef } from 'react';
import echarts from 'echarts';
import themeMgr from './support/themes';

interface EnvironmentChartPropTypes {
  data?: object[];
  className?: string;
  style?: CSSProperties;
  title?: string;
}

function initChart(container: HTMLDivElement, data: object[], title?: string) {
  const chart = echarts.init(container);
  chart.setOption({
    color: themeMgr.getThemeColor(),
    title: {
      text: title,
      left: 'center',
      bottom: 0,
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: '来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          {value: 335, name: '直接访问'},
          {value: 310, name: '邮件营销'},
          {value: 274, name: '联盟广告'},
          {value: 235, name: '视频广告'},
          {value: 400, name: '搜索引擎'}
        ].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
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
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  });
}

const EnvironmentChart: React.FC<EnvironmentChartPropTypes> = ({ data, title, className, style }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && data && data.length > 0) {
      initChart(domRef.current, data, title);
    }
  }, [data, title]);

  return <div ref={domRef} className={className} style={style} />;
};

export default EnvironmentChart;
