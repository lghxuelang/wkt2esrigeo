import React, { useRef, useEffect } from 'react';
import TitlePanel from '@/components/containers/titlePanel';
import { viewUtils, buildingUtils, layerCreator } from '@/utils/arcgis';
import imgSrc from './images/back.png';
import styles from './index.less';
import echarts from 'echarts';
import { Radio } from "antd";

const buildingLayerUrl = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/建筑/SceneServer';
const vectorTLayerUrl1 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E4%B8%AD%E5%BF%83%E7%BA%BF/VectorTileServer';
const vectorTLayerUrl2 = 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E9%81%93%E8%B7%AF%E5%88%86%E7%BA%A7%E5%88%AB%E6%98%BE%E7%A4%BA_%E7%AC%A6%E5%8F%B7%E4%B8%8D%E5%8F%98_20180628/VectorTileServer';
interface optServer {
    type: String,
    url: String,
  }
interface PublicTrafficPropTypes {
    backUp: Function;
    layerArr: Array<optServer>;
}

const PublicTraffic: React.FC<PublicTrafficPropTypes> = ({ backUp, layerArr }) => {

    const barChartRef: React.Ref<HTMLDivElement> = useRef(null);
    const scatterChartRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {

        viewUtils.isViewReady().then(async () => {
            if (window.agsGlobal) {
              window.agsGlobal.view.map.removeAll();
            }
            layerArr = [
            {type:'VectorTileLayer',url:vectorTLayerUrl1},
            {type:'VectorTileLayer',url:vectorTLayerUrl2},
          ]
            for( let i: number = 0; i < layerArr.length; i++ ){
              const opt = {
                type: layerArr[i].type,
                title: layerArr[i].type + i.toString(),
                url: layerArr[i].url,
              };
              if (window.agsGlobal) {
                buildingUtils.add(window.agsGlobal.view, opt);
              }
            }
          });
        
        if (scatterChartRef.current) {
            const chart = echarts.init(scatterChartRef.current);
            let options: echarts.EChartOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (obj) {
                        return '线路：' + obj.name + '<br />人数：' + obj.value[0]
                    }
                },
                polar: {},
                radiusAxis: {
                    min: 0,
                    max: function (value) {
                        return value.max + 5;
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine:{
                        lineStyle:{
                            color:'rgba(255,255,255,.3)'
                        }
                      }
                },
                angleAxis: {
                    type: 'category',
                    data: ['线路5', '线路4', '线路3', '线路2', '线路1'],
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        fontSize: 12,
                        fontFamily: 'AlibabaPuHuiTi- Regular, AlibabaPuHuiTi',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 1)',
                        lineHeight: 17,
                    },
                    axisLine: {
                        lineStyle:{
                            color:'rgba(255,255,255,.5)'
                        }
                    }, 
                },
                series: [{
                    type: 'scatter',
                    coordinateSystem: 'polar',
                    data: [
                        {
                            value: [45, '线路1'],
                            symbolSize: 45,
                            itemStyle: {
                                color: '#00FFF9',
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: 'rgba(0,255,248,.8)',
                                    shadowBlur: 20
                                }
                            }

                        },
                        {
                            value: [7, '线路2'],
                            symbolSize: 7,
                            itemStyle: {
                                color: '#00FFF9'
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: 'rgba(0,255,248,.8)',
                                    shadowBlur: 7
                                }
                            }
                        }
                        , {
                            value: [30, '线路3'],
                            symbolSize: 30,
                            itemStyle: {
                                color: '#6648FF'
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: 'rgba(102,72,255,.8)',
                                    shadowBlur: 30
                                }
                            }
                        }, {
                            value: [10, '线路4'],
                            symbolSize: 10,
                            itemStyle: {
                                color: '#6648FF'
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: 'rgba(102,72,255,.8)',
                                    shadowBlur: 10
                                }
                            }


                        },
                        {
                            value: [20, '线路5'],
                            symbolSize: 20,
                            itemStyle: {
                                color: '#00FFF9'
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: 'rgba(0,255,248,.8)',
                                    shadowBlur: 20
                                }
                            }

                        }
                    ],

                }]
            };

            chart.setOption(options);
        }
           // 卸载组件时移出所有图层
    return ()=>{
        if (window.agsGlobal) {
            window.agsGlobal.view.map.removeAll();
            layerArr = [
                {type:'SceneLayer',url:buildingLayerUrl},
                {type:'VectorTileLayer',url:vectorTLayerUrl1},
                {type:'VectorTileLayer',url:vectorTLayerUrl2},
              ]
                for( let i: number = 0; i < layerArr.length; i++ ){
                  const opt = {
                    type: layerArr[i].type,
                    title: layerArr[i].type + i.toString(),
                    url: layerArr[i].url,
                  };
                  if (window.agsGlobal) {
                    buildingUtils.add(window.agsGlobal.view, opt);
                  }
                }
        }
      }
    }, [scatterChartRef]);

    useEffect(() => {
        if (barChartRef.current) {
            const chart = echarts.init(barChartRef.current);
            let options: echarts.EChartOption = {
                title: {
                    text: '线路1下车人数统计',
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                        fontWeight: "400",
                        color: 'white',
                        lineHeight: 20,
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '站点：{b0}<br />{a0}: {c0}<br />{a1}: {c1}'
                },
                legend: {
                    data: ['上车人数', '下车人数'],
                    show: false,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        name: '站名',
                        type: 'category',
                        boundaryGap: false,
                        data: ["升仙湖站", "火车北站", "人民北路站", "文殊院站", "骡马市站", "天府广场站", "锦江宾馆站"],
                        axisLabel: {
                            show: false,
                            color: 'rgba(255,255,255,1)',
                            lineHeight: 17,
                            fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                            fontSize: 12,
                            fontWeight: '400'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            color: 'rgba(255,255,255,1)',
                            lineHeight: 17,
                            fontFamily: 'AlibabaPuHuiTi-Regular,AlibabaPuHuiTi',
                            fontSize: 12,
                            fontWeight: '400'
                        },
                        axisLine: {
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,.3)',
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '上车人数',
                        type: 'line',
                        stack: '总量',
                        lineStyle: {
                            color: '#00FFF8',
                        },
                        areaStyle: {
                            color: '#00FFF8',
                        },
                        data: [2, 25, 13, 10, 22, 25, 30],
                        smooth: true,
                        showSymbol: false,
                    },
                    {
                        name: '下车人数',
                        type: 'line',
                        stack: '总量',
                        data: [0, 20, 10, 5, 11, 10, 15],
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            color: 'rgba(0,255,248,.6)',
                        },
                        areaStyle: {
                            color: 'rgba(0,255,248,.6)',
                        },
                    }
                ]
            };

            chart.setOption(options);
        }
    }, [barChartRef]);
    return (
        <TitlePanel
            title={
                <div className={styles.titleWrap}>
                    <img alt="" src={imgSrc} onClick={() => {
                        backUp('cityGeneral')
                    }} />
          公共交通
        </div>
            }
            className={styles.publicTraffic}
        >
            <div className={styles.content}>
                <div className={styles.chart1Container}>
                    <div className={styles.title}>
                        <span className={styles.peopleCount}>线路人数统计</span>
                        <div >
                            <Radio.Group onChange={() => { }} defaultValue="all">
                                <Radio.Button value="all">全部</Radio.Button>
                                <Radio.Button value="week">本周</Radio.Button>
                                <Radio.Button value="moth">本月</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className={styles.chart1} ref={scatterChartRef}>

                    </div>
                </div>
                <div className={styles.chart2} ref={barChartRef}>

                </div>
            </div>
        </TitlePanel>
    );
};

export default PublicTraffic;
