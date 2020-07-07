import React, { CSSProperties, useEffect, useRef } from 'react';
import enchants from 'echarts';
import themeMgr from './support/themes';

interface LandPieChartPropTypes {
  dataset?: [string, number][];
  className?: string;
  style?: CSSProperties;
  title?: string;
  legendSelectChanged?: Function;
  pieSelectChanged?: Function;
  

}

function initChart(container: HTMLDivElement, data: [string, number][], title?: string, legendSelectChanged?: Function, pieSelectChanged?: Function) {
  const chart = enchants.init(container);
  let options:enchants.EChartOption = {
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
    },
    title: {
      text: title,
      show: true,
      left: '20%',
      bottom: '55%',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    },
    dataset: {
      source: data
    },
    series: [
      {
        name: '来源',
        type: 'pie',
        radius: ['40%', '55%'],
        center: ['25%', '40%'],
        avoidLabelOverlap: false,
        selectedMode: 'single',
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
    ],
  };
  chart.setOption(options, true);
  // 图例切换
  if (legendSelectChanged) {
    chart.off('legendselectchanged');
    chart.on('legendselectchanged', (params) => {
      var isSelected = params.selected[params.name];
      legendSelectChanged({
        name: params.name,
        isSelected
      })
    });
  }

  if (pieSelectChanged) {
    chart.off('pieselectchanged');
    chart.on('pieselectchanged', (params) => {
      let isSelected = params.selected[params.name];
      pieSelectChanged({
        name: params.name,
        isSelected
      })
    });
  }
}

const LandPieChart: React.FC<LandPieChartPropTypes> = ({
  dataset,
  title,
  className,
  style,
  legendSelectChanged,
  pieSelectChanged,
}) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && dataset && dataset.length > 0 && title) {
      initChart(domRef.current, dataset, title, legendSelectChanged, pieSelectChanged);
    }
  }, []);

  return <div ref={domRef} className={className} style={style} />;
};

export default LandPieChart;
