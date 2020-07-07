import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { Input } from 'antd';
import ControlBrowseBlock from './components/ControlBrowseBlock';
import BlockAreaDetail from './components/BlockAreaDetail'
import FeatureLayer from "esri/layers/FeatureLayer";
import { viewUtils } from '@/utils/arcgis';

const { Search } = Input;

interface ControlBrowPropTypes {
}

interface landBlockItem {
  name: string;  // 片区ID
  area: string; // 面积，单位公顷
  geometry: any; // 图形
}


const streetBlockLayerId = 'streetBlockLayer';
const controlLandBlockLayerId = 'controlLandBlock'; // 控规_地块_201411

const ControlBrowse: React.FC<ControlBrowPropTypes> = () => {
  const [currentModule, setCurrentModule] = useState<string>('ControlBrowseBlock');
  const [blockLandDatas, setBlockLandDatas] = useState<landBlockItem[]>();
  const [detailGeometry, setDetailGeometry] = useState();  // 查询详情的空间条件

  // 设置街区图层可见
  useEffect(() => {
    if (window.agsGlobal) {
      let streetBlockLayer = window.agsGlobal.view.map.findLayerById(streetBlockLayerId);
      streetBlockLayer.visible = true;
      let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(controlLandBlockLayerId);
      controlLandBlockLayer.visible = true;
    }
    return () => {
      if (window.agsGlobal) {
        let streetBlockLayer = window.agsGlobal.view.map.findLayerById(streetBlockLayerId);
        if (streetBlockLayer) {
          streetBlockLayer.visible = false;
        }
        let controlLandBlockLayer = window.agsGlobal.view.map.findLayerById(controlLandBlockLayerId);
        if (controlLandBlockLayer) {
          controlLandBlockLayer.visible = false;
        }
      }
    };
  }, []);

  useEffect(() => {
    getLandBlockData('1=1').then((data) => {
      setBlockLandDatas(data);
    })
  }, []);

  // query查询，获取列表需要的数据
  const getLandBlockData = async (where) => {
    const mapView = await viewUtils.isViewReady();
    let streetBlockLayer = mapView.map.findLayerById(streetBlockLayerId) as FeatureLayer;
    var query = streetBlockLayer.createQuery();
    query.where = where;
    query.outFields = ['fid', 'ghydmj'];
    query.returnGeometry = true;
    const result = await streetBlockLayer.queryFeatures(query);
    let features = result.features;
    let tableData: landBlockItem[] = [];
    for (let i = 0, len = features.length; i < len; i++) {
      let attributes = features[i].attributes;
      let name: string = attributes.fid;
      let count: number = attributes.ghydmj
      let geometry = features[i].geometry
      tableData.push({
        name: name,
        area: count.toFixed(2),
        geometry: geometry
      })
    }
    return tableData;
  }



  return (
    <div className={styles['wrapper']}>
      <div className={styles['searchDiv']}>
        <Search
          placeholder="请搜索关键词"
          onSearch={(value) => {
            let where = '1=1';
            if (value.trim() !== '') {
              let fid = value.replace(/[^0-9]/ig, "");
              where = `fid=${fid}`;
            }
            getLandBlockData(where).then((data) => {
              setBlockLandDatas(data);
            })
          }}
          style={{ height: 40 }}
        />
      </div>

      <div className={styles.tableContainer}>
        {currentModule === 'ControlBrowseBlock' ?
          <ControlBrowseBlock
            showBlockLandDetail={(geometry) => {
              setCurrentModule('BlockAreaDetail');
              setDetailGeometry(geometry);
            }}
            listData={blockLandDatas}
          /> : null}
        {currentModule === 'BlockAreaDetail' ?
          <BlockAreaDetail
            geometry={detailGeometry}
            backUp={() => {
              setCurrentModule('ControlBrowseBlock');
            }} /> : null}
      </div>

    </div>
  );
};

export default ControlBrowse;
