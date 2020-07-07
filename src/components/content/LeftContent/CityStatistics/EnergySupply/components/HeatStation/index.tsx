import React, { useRef, useEffect } from 'react';
import styles from './index.less';
import echarts from 'echarts';
import { Select } from 'antd';
const { Option } = Select;

interface HeatStationPropTypes { }

const HeatStation: React.FC<HeatStationPropTypes> = () => {
    const barChartRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (barChartRef.current) {
            const chart = echarts.init(barChartRef.current);
            // y轴最长文本*fontSzie=12
            let yAxisTextWidth = 12 * 12;
            let options: echarts.EChartOption = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                title: [{
                    text: '一次供水温度',
                    textStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                        fontWeight: '400',
                        lineHeight: 20,
                    },
                    top: '40%',
                    left: '12%'
                }, {
                    text: '二次供水温度',
                    textStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                        fontWeight: '400',
                        lineHeight: 20,
                    },
                    top: '40%',
                    right: '12%'
                }, {
                    text: '一次回水温度',
                    textStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                        fontWeight: '400',
                        lineHeight: 20,
                    },
                    top: '90%',
                    left: '12%'
                }, {
                    text: '二次回水温度',
                    textStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                        fontWeight: '400',
                        lineHeight: 20,
                    },
                    top: '90%',
                    right: '12%'
                }],
                series: [
                    {
                        name: '一次供水温度',
                        type: 'gauge',
                        center: ['25%', '25%'],
                        radius: '30%',
                        title: {
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 20,
                        },
                        detail: {
                            color: 'white',
                            fontSize: 18,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: 'bold',
                            lineHeight: 25,
                        },
                        data: [{ value: 52.28, name: '℃' }],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: [[0.5228, '#00FFF9'], [1, '#20242B']],
                                width: 10,

                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 17,
                            distance: -50,
                        },
                        splitNumber: 4,
                        pointer: {
                            show: false
                        }
                    }, {
                        name: '二次供水温度',
                        center: ['75%', '25%'],
                        radius: '30%',
                        type: 'gauge',
                        title: {
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 20,
                        },
                        detail: {
                            color: 'white',
                            fontSize: 18,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: 'bold',
                            lineHeight: 25,
                        },
                        data: [{ value: 52.28, name: '℃' }],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: [[0.5228, '#00FFF9'], [1, '#20242B']],
                                width: 10,

                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 17,
                            distance: -50,
                        },
                        splitNumber: 4,
                        pointer: {
                            show: false
                        }
                    }, {
                        name: '一次回水温度',
                        center: ['25%', '75%'],
                        radius: '30%',
                        type: 'gauge',
                        title: {
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 20,
                        },
                        detail: {
                            color: 'white',
                            fontSize: 18,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: 'bold',
                            lineHeight: 25,
                        },
                        data: [{ value: 52.28, name: '℃' }],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: [[0.5228, '#00FFF9'], [1, '#20242B']],
                                width: 10,

                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 17,
                            distance: -50,
                        },
                        splitNumber: 4,
                        pointer: {
                            show: false
                        }
                    }, {
                        name: '二次回水温度',
                        type: 'gauge',
                        center: ['75%', '75%'],
                        radius: '30%',
                        title: {
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 20,
                        },
                        detail: {
                            color: 'white',
                            fontSize: 18,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: 'bold',
                            lineHeight: 25,
                        },
                        data: [{ value: 52.28, name: '℃' }],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: [[0.5228, '#00FFF9'], [1, '#20242B']],
                                width: 10,

                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'AlibabaPuHuiTi-Bold,AlibabaPuHuiTi',
                            fontWeight: '400',
                            lineHeight: 17,
                            distance: -50,
                        },
                        splitNumber: 4,
                        pointer: {
                            show: false
                        }
                    }
                ]
            }
            chart.setOption(options, { notMerge: true });
        }

    }, [barChartRef]);

    return (
        <div className={styles.heatStation}>
            <div className={styles.stationChoose}>
                <p>站点选择</p>
                <Select defaultValue="stationA" className={styles.stationSelect}>
                    <Option value="stationA">A供热站</Option>
                    <Option value="stationB">B供热站</Option>
                    <Option value="stationC">C供热站</Option>
                </Select>
            </div>
            <div className={styles.barChartContainer} ref={barChartRef}>

            </div>
        </div>
    );
};

export default HeatStation;
