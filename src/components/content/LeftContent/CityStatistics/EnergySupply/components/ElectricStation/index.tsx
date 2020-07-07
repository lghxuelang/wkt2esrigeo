import React, { useRef, useEffect } from 'react';
import styles from './index.less';
import echarts from 'echarts';


interface ElectricStationPropTypes { }

const ElectricStation: React.FC<ElectricStationPropTypes> = () => {
    const pipChartRef: React.Ref<HTMLDivElement> = useRef(null);
    const barChartRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (pipChartRef.current) {
            const chart = echarts.init(pipChartRef.current);
            let options: echarts.EChartOption = {
                title: {
                    text: '光伏累计发电量(千瓦/时)',
                    top: 24,
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 20,
                    }
                },
                grid: {
                    show: true,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.15)',
                    left: 0,
                    bottom: 32,
                    right: 0,
                    top: 60,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: '60%',
                    top: 'middle',
                    // borderWidth: 1,
                    // borderColor: 'red',
                    data: ['光伏4', '2#能源站光伏', '停车场光伏', '光伏3', '其他'],
                    textStyle: {
                        fontSize: 12,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 17,
                    }
                },
                color: ['#4346D3', '#16CEB9', '#6648FF', '#2D99FF', '#20242B'],
                // backgroundColor:'#0DFFFFFF',
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        avoidLabelOverlap: false,
                        center: ['26%', '55.1%'],
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 335, name: '光伏4' },
                            { value: 310, name: '2#能源站光伏' },
                            { value: 234, name: '停车场光伏' },
                            { value: 135, name: '光伏3' },
                            { value: 1548, name: '其他' }
                        ]
                    }
                ]
            };

            chart.setOption(options);
        }
    }, [pipChartRef]);

    useEffect(() => {
        if (barChartRef.current) {
            const chart = echarts.init(barChartRef.current);
            let options: echarts.EChartOption = {
                title: {
                    text: '风力累计发电量(千瓦/时)',
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 20,
                    }
                },
                color: ['#00FFF9'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['1#风机', '2#风机', '3#风机', '4#风机', '5#风机'],
                    axisLabel: {
                        color: 'rgba(255,255,255,1)',
                        lineHeight: 17,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontSize: 12,
                        fontWeight: '400'
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '千瓦时',
                    nameTextStyle: {
                        color: 'rgba(255,255,255,.5)',
                        lineHeight: 17,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontSize: 12,
                        fontWeight: '400'
                    },
                    axisLabel: {
                        color: 'rgba(255,255,255,1)',
                        lineHeight: 17,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontSize: 12,
                        fontWeight: '400'
                    },
                    axisLine:{
                        show:false,
                    },
                    splitLine:{
                        lineStyle:{
                            color: 'rgba(255,255,255,.3)',
                        }
                    }
                },
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: 16,
                        data: [3200, 1400, 700, 2300, 300]
                    }
                ]
            };

            chart.setOption(options);
        }

    }, [barChartRef]);

    return (
        <div className={styles.electricStation}>
            <div className={styles.pipChartContainer} ref={pipChartRef}>

            </div>
            <div className={styles.barChartContainer} ref={barChartRef}>

            </div>
        </div>
    );
};

export default ElectricStation;
