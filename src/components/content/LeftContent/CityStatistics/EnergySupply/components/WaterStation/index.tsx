import React, { useRef, useEffect } from 'react';
import styles from './index.less';
import echarts from 'echarts';


interface WaterStationPropTypes { }

const WaterStation: React.FC<WaterStationPropTypes> = () => {
    const barChartRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (barChartRef.current) {
            const chart = echarts.init(barChartRef.current);
            // y轴最长文本*fontSzie=12
            let yAxisTextWidth=12*12;
            let options: echarts.EChartOption = {
                title: {
                    text: '供水量统计（单位吨）',
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: '400',
                        color: 'white',
                        lineHeight: 20,
                    },
                    subtext: '{normal|总供水量}\n{totalNumber|74吨}',
                    subtextStyle: {
                        rich: {
                            normal: {
                                fontSize: 12,
                                fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                                fontWeight: '400',
                                color: 'rgba(255,255,255,.5)',
                                lineHeight: 17,
                            },
                            totalNumber: {
                                fontSize: 24,
                                fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                                fontWeight: 'bold',
                                color: 'rgba(0,255,249,1)',
                                lineHeight: 33,
                            }
                        }
                    },
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    },
                },
                color: ["#00FFF9", "#FF6F8E", "#B6A2DE", "#5AB1EF", "#FFB980", "#91c7ae", "#749f83",],
                grid: {
                    left: yAxisTextWidth,
                    right: "4%",
                    top:'119px',
                    bottom: "0%",
                    containLabel: true,
                },
                yAxis: [{
                    type: "category",
                    data: ['汇丰西樵', '世贸生态展览馆', '中天和风路口', '公园1b', '韩北路', '中津中天（世贸03）', '中天东侧（世贸03门口）', '南部泵站出口', '动漫北路'],
                    axisLabel: {
                        color: "white",
                        fontWeight: "400",
                        lineHeight: 17,
                        fontSize: 12,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        align:'left',
                        inside:true,
                        margin:-yAxisTextWidth,
                    },
                    axisTick: {
                        show: false
                    },
                }],
                xAxis: {
                    type: "value",
                    axisLabel: {
                        color: "white",
                        fontWeight: "400",
                        lineHeight: 17,
                        fontSize: 12,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',

                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'white',
                            opacity: 0.3
                        }
                    }
                },
                series: [{
                    type: "bar",
                    name: '管点',
                    data: [5, 21, 3, 16, 8, 12, 3, 7, 4],
                    itemStyle: {
                        barBorderRadius: [0, 100, 100, 0],
                    },
                    label: {
                        show: true,
                        position: 'right'
                    },
                    barWidth: 8,
                }]
            }
            chart.setOption(options, { notMerge: true });
        }

    }, [barChartRef]);

    return (
        <div className={styles.waterStation}>
            <div className={styles.barChartContainer} ref={barChartRef}>

            </div>
        </div>
    );
};

export default WaterStation;
