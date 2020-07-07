import React, { useRef, useEffect } from 'react';
import styles from './index.less';
import echarts from 'echarts';


interface GasStationPropTypes { }

const GasStation: React.FC<GasStationPropTypes> = () => {
    const barChartRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (barChartRef.current) {
            const chart = echarts.init(barChartRef.current);
            // y轴最长文本*fontSzie=12
            let yAxisTextWidth = 12 * 12;
            let options: echarts.EChartOption = {
                title: {
                    text: '燃气门站累计流量（单位：m3）',
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 20,
                    }
                },
                color: ['#16CEB9', '#4346D3', '#6648FF', '#2D99FF', '#FF8248', '#D34385'],
                legend: {
                    data: ['燃气1#', '燃气2#', '燃气3#', '燃气4#', '华燊1#', '华燊2#'],
                    top:'10.3%', // 44px
                    left:'0%',
                    textStyle: {
                        fontSize: 12,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 17,
                    }
                },
                grid:{
                    top:'31%',
                },
                xAxis: [{
                    type: 'category',
                    data: ['南部燃门站', '北部燃气门站'],
                    axisLabel: {
                        color: 'rgba(255,255,255,1)',
                        lineHeight: 17,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontSize: 12,
                        fontWeight: '400'
                    },
                    splitLine:{
                        show:true,
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)',
                        }
                    },
                    axisTick:{
                        show:false,
                    },
                }],
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: 'rgba(255,255,255,1)',
                        lineHeight: 17,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontSize: 12,
                        fontWeight: '400'
                    },
                    axisTick:{
                        show:false,
                    },
                    splitLine: {
                        show:true,
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)',
                        }
                    }
                },
                series: [
                    {
                        name: '燃气1#',
                        type: 'bar',
                        data: [520, 920],
                        barWidth: 8,
                        barGap: '100%'
                    }, {
                        name: '燃气2#',
                        type: 'bar',
                        data: [430, 830],
                        barWidth: 8,
                        barGap: '100%'
                    }, {
                        name: '燃气3#',
                        type: 'bar',
                        data: [180, 520],
                        barWidth: 8,
                        barGap: '100%'
                    }, {
                        name: '燃气4#',
                        type: 'bar',
                        data: [570, 770],
                        barWidth: 8,
                        barGap: '100%'
                    }, {
                        name: '华燊1#',
                        type: 'bar',
                        data: [230, 30],
                        barWidth: 8,
                        barGap: '100%'
                    }, {
                        name: '华燊2#',
                        type: 'bar',
                        data: [790, 310],
                        barWidth: 8,
                        barGap: '100%'
                    }
                ]
            }
            chart.setOption(options, { notMerge: true });
        }

    }, [barChartRef]);

    return (
        <div className={styles.gasStation}>
            <div className={styles.barChartContainer} ref={barChartRef}>

            </div>
        </div>
    );
};

export default GasStation;
