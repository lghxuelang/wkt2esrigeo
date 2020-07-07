import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { CheckOutlined } from '@ant-design/icons'
import echarts from 'echarts';


function initChart(container: HTMLDivElement, yAxis: { data: Array<string> } = { data: ['1'] }, series: Array<Object>) {
    const chart = echarts.init(container);
    let constructorSeries: Array<any> = [];
    for (let i = 0, len = series.length; i < len; i++) {
        let serie = {
            ...series[i],
            type: "bar",
            itemStyle: {
                barBorderRadius: [0, 100, 100, 0],
            },
            label: {
                show: true,
                position: 'right'
            },
            barWidth: "8",
        }
        constructorSeries.push(serie)
    }

    let yAxisData = yAxis.data;
    let maxTextWidth = yAxisData[0].length;
    for (let i = 1, len = yAxisData.length; i < len; i++) {
        if (yAxisData[i].length > maxTextWidth) {
            maxTextWidth = yAxisData[i].length
        }
    }
    let options: echarts.EChartOption = {
        title: {
            show: false,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
        },
        color: ["#00FFF9", "#FF6F8E", "#B6A2DE", "#5AB1EF", "#FFB980", "#91c7ae", "#749f83",],
        grid: {
            left: (maxTextWidth * 12+16),
            right: "4%",
            bottom: "3%",
            containLabel: true
        },
        yAxis: {
            type: "category",
            // data: ['中水', '天然气', '气力', '污水', '热水', '煤气', '电信', '路灯', '输配水管', '雨水', '广播'],
            data: yAxis.data,
            axisLabel: {
                color: "white",
                fontWeight: "400",
                lineHeight: 17,
                fontSize: 12,
                fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                // 左对齐
                align: 'left',
                inside: true,
                margin: -(maxTextWidth * 12+16),
            },
            axisTick: {
                show: false
            }
        },
        xAxis: {
            type: "value",
            nameTextStyle: {
                color: "white",
                fontWeight: "400",
                lineHeight: 17,
                fontSize: 12,
                fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi'
            },
            axisLabel: {
                color: "white"
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
        series: constructorSeries
    }
    chart.setOption(options, { notMerge: true });
}

interface ISerie {
    name: String,
    data: Array<Number>
}

interface UnderPipelinePropTypes {
    data: {
        yAxis: { data: Array<string> },
        series: Array<ISerie>
    }
}

const UnderPipeline: React.FC<UnderPipelinePropTypes> = ({ data }) => {
    const [pipepointActive, setPipepointActive] = useState(true);
    const [pipelineActive, setPipelineActive] = useState(false);
    const chartRef: React.Ref<HTMLDivElement> = useRef(null);
    const [currentSeries, setCurrentSeries] = useState([data.series[0]]);

    // 初始化表格
    useEffect(() => {
        if (chartRef.current) {
            let serie = data.series[0]
            setCurrentSeries([serie])
        }
    }, [chartRef]);

    // 更新表格
    useEffect(() => {
        if (currentSeries && chartRef.current) {
            let chart = initChart(chartRef.current, data.yAxis, currentSeries);
        }
    }, [currentSeries]);

    function upDateSeries(activeStates): Array<ISerie> {
        let currentSeries: Array<ISerie> = [];
        for (let i = 0, len = data.series.length; i < len; i++) {
            if (data.series[i].name == '管点' && activeStates.pipepointActive) {
                currentSeries.push(data.series[i])
            } else if (data.series[i].name == '管线' && activeStates.pipelineActive) {
                currentSeries.push(data.series[i])
            }
        }
        return currentSeries;
    }

    return (
        <div className={styles.underPipeline}>
            <div className={styles.switchBtns}>
                <div
                    className={pipepointActive ? [styles.btnItem, styles.btnChoosed].join(' ') : styles.btnItem}
                    onClick={() => {
                        setPipepointActive(!pipepointActive);
                        let currentSeries = upDateSeries({
                            pipepointActive: !pipepointActive,
                            pipelineActive,
                        })
                        setCurrentSeries(currentSeries);
                    }}
                >
                    <span>管点</span>
                    <CheckOutlined style={{ visibility: pipepointActive ? 'visible' : 'hidden' }} />
                </div>
                <div
                    className={pipelineActive ? [styles.btnItem, styles.btnChoosed].join(' ') : styles.btnItem}
                    onClick={() => {
                        setPipelineActive(!pipelineActive)
                        let currentSeries = upDateSeries({
                            pipepointActive,
                            pipelineActive: !pipelineActive,
                        })
                        setCurrentSeries(currentSeries)
                    }}
                >
                    <span>管线</span>
                    <CheckOutlined style={{ visibility: pipelineActive ? 'visible' : 'hidden' }} />
                </div>
            </div>
            <div className={styles.chartContainer} ref={chartRef}>

            </div>

        </div>
    );
};

export default UnderPipeline;
