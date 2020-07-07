import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { Input } from 'antd';
import FeatureLayer from "esri/layers/FeatureLayer";
import { jsapi, viewUtils } from '@/utils/arcgis';
import GraphicsLayer from "esri/layers/GraphicsLayer";

interface landBlockItem {
    name: string;  // 片区ID
    area: string; // 面积，单位公顷
    geometry: any; // 图形
}

interface ControlBrowBlockPropTypes {
    showBlockLandDetail: Function;
    listData?: landBlockItem[];

}

const streetBlockLayerId = 'streetBlockLayer';
const ControlBrowseBlock: React.FC<ControlBrowBlockPropTypes> = ({ showBlockLandDetail, listData = [] }) => {

    // // 高亮满足条件的地块
    // const highlightLand = async (where) => {
    //     const [GraphicsLayer, SimpleFillSymbol] = await jsapi.load(["esri/layers/GraphicsLayer", 'esri/symbols/SimpleFillSymbol']);
    //     let highlightGraphicLayer = window.agsGlobal.view.map.findLayerById('streetBlockLayerHightlightLayer') as GraphicsLayer;
    //     if (!highlightGraphicLayer) {
    //         highlightGraphicLayer = new GraphicsLayer({
    //             id: 'streetBlockLayerHightlightLayer'
    //         });
    //         window.agsGlobal.view.map.add(highlightGraphicLayer);
    //     }
    //     let masterLandLayer = window.agsGlobal.view.map.findLayerById(streetBlockLayerId) as FeatureLayer;;
    //     var query = masterLandLayer.createQuery();
    //     query.where = where;
    //     masterLandLayer.queryFeatures(query).then((results) => {
    //         let features = results.features;
    //         for (let i = 0, len = features.length; i < len; i++) {
    //             features[i].symbol = new SimpleFillSymbol({
    //                 color: '#ff0000'
    //             })
    //         }
    //         highlightGraphicLayer.removeAll()
    //         highlightGraphicLayer.addMany(results.features);
    //     })
    // }

    // 定位到满足条件的土地extent
    const goToLand = async (where) => {
        const mapView = await viewUtils.isViewReady();
        let masterLandLayer = mapView.map.findLayerById(streetBlockLayerId) as FeatureLayer;;
        var query = masterLandLayer.createQuery();
        query.where = where;
        let results:any = await masterLandLayer.queryExtent(query);
        mapView.goTo(results.extent);
    }

    return (
        <div className={styles.controlBrowseBlock}>
            {listData.map((item) => {
                return (
                    <div className={styles['item']} onClick={() => {
                        goToLand(`fid='${item.name}'`)
                        showBlockLandDetail(item.geometry);
                        // highlightLand(`fid='${item.name}'`);
                    }}>
                        <img src="" alt="" className={styles.img} />
                        <div className={styles['detail']}>
                            <span>{`第${item.name}街区`}</span>
                            <span>控制性详细规划</span>
                            <div>
                                <span>{item.area}</span>
                                <span>公顷</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ControlBrowseBlock;
