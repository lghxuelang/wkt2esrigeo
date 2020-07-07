import React, { CSSProperties, useEffect, useRef } from 'react';
import echarts from 'echarts';
import themeMgr from './support/themes';

interface EnvironmentLinePropTypes {
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
    legend: {
      data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '邮件营销',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        stack: '总量',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        stack: '总量',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        stack: '总量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  });
}

const EnvironmentLine: React.FC<EnvironmentLinePropTypes> = ({ data, title, className, style }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (domRef.current && data && data.length > 0) {
      initChart(domRef.current, data, title);
    }
  }, [data, title]);

  return <div ref={domRef} className={className} style={style} />;
};

export default EnvironmentLine;
