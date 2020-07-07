import React, { useEffect, useState } from 'react';
import styles from './index.less';
import imgSrc from './images/back.png';
import { Collapse } from 'antd';
const { Panel } = Collapse;
import { jsapi, viewUtils } from '@/utils/arcgis';
import FeatureLayer from "esri/layers/FeatureLayer";
import GraphicsLayer from "esri/layers/GraphicsLayer";

interface BlockAreaDetailPropTypes {
    backUp: Function;
    geometry: any; // 空间过滤图形
}

interface LandItem {
    type: string;   // 用地性质
    typeCode: string; // 用地性质编码
    landCode?: string; // 地块编码
    supportDevice: string;// 配套设施
}



const controlLandBlockLayerId = 'controlLandBlock'; // 控规_地块_201411
const landBlockDetailHightlightLayerId = 'landBlockDetailHightlightLayer';// 高亮图层ID

const BlockAreaDetail: React.FC<BlockAreaDetailPropTypes> = ({ backUp, geometry }) => {
    const [activeLandType, setActiveLandType] = useState('');
    const [tableData, setTableData] = useState<LandItem[]>();
    const [landItems, setLandItems] = useState([]);

    useEffect(() => {
        getLandBlockDetail(geometry).then((data) => {
            setTableData(data);
        });
    }, [geometry]);

    // 高亮图层
    useEffect(() => {
        return () => {
            if (window.agsGlobal) {
                let highlightGraphicLayer = window.agsGlobal.view.map.findLayerById(landBlockDetailHightlightLayerId);
                if (highlightGraphicLayer) {
                    window.agsGlobal.view.map.remove(highlightGraphicLayer);
                }
            }
        }
    }, []);

    // 获取某个街区，用地性质统计信息
    const getLandBlockDetail = async (geometry) => {
        const mapView = await viewUtils.isViewReady();
        let controlLandBlockLayer = mapView.map.findLayerById(controlLandBlockLayerId) as FeatureLayer;
        var query = controlLandBlockLayer.createQuery();
        query.geometry = geometry;
        query.outFields = ['ydxz', "ydxzbm", 'ptss'];
        query.returnDistinctValues = true;
        let result = await controlLandBlockLayer.queryFeatures(query);
        let features = result.features;
        let tableData: LandItem[] = [];
        for (let i = 0, len = features.length; i < len; i++) {
            let attributes = features[i].attributes;
            let name: string = attributes.ydxz;
            let typeCode: string = attributes.ydxzbm;
            let supportDevice: string = attributes.ptss;
            tableData.push({
                type: name,
                typeCode: typeCode,
                supportDevice
            })
        }
        return tableData;
    }

    /**
   * 查询某一类地块类型下的所有地块
   * @param condition 
   */
    const queryLandItemsOfOnTypeLand = async (condition: string, geometry) => {
        const mapView = await viewUtils.isViewReady();
        let masterLandLayer = mapView.map.findLayerById(controlLandBlockLayerId) as FeatureLayer;
        var query = masterLandLayer.createQuery();
        query.where = condition;
        query.outFields = ['ydxz', "ydxzbm", 'fid'];
        query.geometry = geometry;
        let result = await masterLandLayer.queryFeatures(query);

        let features = result.features;
        let tableData: LandItem[] = [];
        for (let i = 0, len = features.length; i < len; i++) {
            let attributes = features[i].attributes;
            let name: string = attributes.ydxz;
            let nameCode: string = attributes.ydxzbm;
            let landCode: string = attributes.fid;
            let supportDevice: string = attributes.ptss;
            tableData.push({
                type: name,
                typeCode: nameCode,
                landCode: landCode,
                supportDevice
            })
        }
        return tableData
    }

    // 定位到满足条件的土地extent
    const goToLand = async (where) => {
        const mapView = await viewUtils.isViewReady();
        let masterLandLayer = mapView.map.findLayerById(controlLandBlockLayerId) as FeatureLayer;;
        var query = masterLandLayer.createQuery();
        query.where = where;
        let results: any = await masterLandLayer.queryExtent(query);
        mapView.goTo(results.extent);
    }

    // 高亮满足条件的地块
    const highlightLand = async (where) => {
        const [GraphicsLayer, SimpleFillSymbol] = await jsapi.load(["esri/layers/GraphicsLayer", 'esri/symbols/SimpleFillSymbol']);
        const mapView = await viewUtils.isViewReady();
        let highlightGraphicLayer = mapView.map.findLayerById(landBlockDetailHightlightLayerId) as GraphicsLayer;
        if (!highlightGraphicLayer) {
            highlightGraphicLayer = new GraphicsLayer({
                id: landBlockDetailHightlightLayerId
            });
            mapView.map.add(highlightGraphicLayer);
        }
        let masterLandLayer = mapView.map.findLayerById(controlLandBlockLayerId) as FeatureLayer;;
        var query = masterLandLayer.createQuery();
        query.where = where;
        masterLandLayer.queryFeatures(query).then((results) => {
            let features = results.features;
            for (let i = 0, len = features.length; i < len; i++) {
                features[i].symbol = new SimpleFillSymbol({
                    color: '#00ff00'
                })
            }
            highlightGraphicLayer.removeAll()
            highlightGraphicLayer.addMany(results.features);
        })
    }


    function landItemOnClick(landCode) {
        goToLand(`fid='${landCode}'`);
        highlightLand(`fid='${landCode}'`);
    }

    function renderLandChilds(data) {
        if (data && data.length > 0) {
            const items = data.map((item) => {
                return (
                    <div className={styles.item} onClick={() => {
                        landItemOnClick(item.landCode);
                    }}>
                        <span>{item.type}</span>
                        <span>{item.typeCode}</span>
                        <span>{item.landCode}</span>
                    </div>
                )
            });
            return items;
        } else {
            return null;
        }

    }

    return (
        <div className={styles.blockAreaDetail}>
            <div className={styles.return}>
                <img alt="" src={imgSrc}
                    onClick={() => {
                        backUp();
                        if (window.agsGlobal) {
                            // 移除高亮图层
                            let highlightGraphicLayer = window.agsGlobal.view.map.findLayerById(landBlockDetailHightlightLayerId) as FeatureLayer;
                            if (highlightGraphicLayer) {
                                window.agsGlobal.view.map.remove(highlightGraphicLayer);
                            }
                        }

                    }} />
                <span
                    onClick={() => {
                        backUp();
                        if (window.agsGlobal) {
                            // 移除高亮图层
                            let highlightGraphicLayer = window.agsGlobal.view.map.findLayerById(landBlockDetailHightlightLayerId) as FeatureLayer;
                            if (highlightGraphicLayer) {
                                window.agsGlobal.view.map.remove(highlightGraphicLayer);
                            }
                        }
                    }}> 返回</span>
            </div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}><span>用地性质</span><span>用地性质编码</span><span>配套设施</span></div>
                <div className={styles.tableBody}>
                    <Collapse
                        accordion={true}
                        activeKey={activeLandType}
                        onChange={(key) => {
                            setActiveLandType(key as string);
                            queryLandItemsOfOnTypeLand(`ydxz='${key}'`, geometry).then((data) => {
                                let newLandItems = [].concat(landItems);
                                newLandItems[key as string] = data;
                                setLandItems(newLandItems);
                            });
                        }}
                    >
                        {tableData ?
                            tableData.map((item) => {
                                return (
                                    <Panel
                                        header={<div className={styles.item}><span>{item.type}</span><span>{item.typeCode}</span><span>{item.supportDevice}</span></div>}
                                        key={item.type}
                                        showArrow={false}
                                    >
                                        {renderLandChilds(landItems[item.type])}
                                    </Panel>
                                );
                            })
                            : null}
                    </Collapse>
                </div>
            </div>
        </div >
    );
};

export default BlockAreaDetail;
