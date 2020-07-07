import React, { useEffect, useState, useRef } from 'react';
import { Slider, Switch } from 'antd';
import styles from './index.less';
import LandPieChart from '@/components/content/LeftContent/charts/LandPieChart';
import { jsapi, viewUtils } from '@/utils/arcgis';
import { Collapse } from 'antd';
import themeMgr from '../../charts/support/themes';
import * as XLSX from 'xlsx';
import FeatureLayer from "esri/layers/FeatureLayer";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";
import GraphicsLayer from 'esri/layers/GraphicsLayer';

const { Panel } = Collapse;

interface UplandSummaryPropTypes {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

interface LandItem {
  type: string;
  typeCode: string;
  landCode?: string;
  area: number; // 平方米
  percenter: string;
}

const masterLandLayerId = 'masterLandLayer'; // '总规'图层ID
const masterLandHightlightLayerId = 'masterLandHightlightLayer'; // 高亮Graphic图层id
// 用地汇总组件
const UplandSummary: React.FC<UplandSummaryPropTypes> = ({ className, style }) => {
  const [chartData, setChartData] = useState<[string, number][]>();
  const [chartTitle, setChartTitle] = useState<string>();
  const [tableData, setTableData] = useState<LandItem[]>();
  const [activeLandType, setActiveLandType] = useState<string>('');
  const activeLandTypeRef = useRef('');
  const [landItems, setLandItems] = useState([]);
  const originalRenderRef = useRef<any>();



  // 设置总规图层可见
  useEffect(() => {
    return () => {
      if (window.agsGlobal) {
        let masterLandLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId);
        if (masterLandLayer) {
          masterLandLayer.visible = false;
          masterLandLayer.renderer = originalRenderRef.current;
        }
      }
    };
  }, []);

  // 高亮图层
  useEffect(() => {
    return () => {
      if (window.agsGlobal) {
        let highlightGraphicLayer = window.agsGlobal.view.map.findLayerById(masterLandHightlightLayerId);
        if (highlightGraphicLayer) {
          window.agsGlobal.view.map.remove(highlightGraphicLayer);
        }
      }
    }
  }, []);


  useEffect(() => {
    getStatisticData().then(({ chartData, chartTitle, tableData }) => {
      setChartData(chartData);
      setChartTitle(chartTitle); // 保留两位小数，单位公顷，默认为平方米
      setTableData(tableData);
    });
  }, []);

  useEffect(() => {
    activeLandTypeRef.current = activeLandType;
  }, [activeLandType]);

  useEffect(() => {
    if (chartData && window.agsGlobal) {
      let masterLandLayer = window.agsGlobal.view.map.findLayerById(masterLandLayerId) as FeatureLayer;
      originalRenderRef.current = masterLandLayer.renderer;
      let render: UniqueValueRenderer = constructorUniqueValueRender(chartData);
      masterLandLayer.renderer = render;
      masterLandLayer.visible = true;
    }
  }, [chartData]);


  // 获取统计信息
  const getStatisticData = async () => {
    const [StatisticDefinition] = await jsapi.load(["esri/tasks/support/StatisticDefinition"]);
    const mapView = await viewUtils.isViewReady();
    let masterLandLayer = mapView.map.findLayerById(masterLandLayerId) as FeatureLayer;
    var query = masterLandLayer.createQuery();
    let statisticDefinition = new StatisticDefinition({
      onStatisticField: "dkmj",
      outStatisticFieldName: "totalArea",
      statisticType: "sum"
    });
    query.outStatistics = [statisticDefinition];
    query.groupByFieldsForStatistics = ["ydxz", "ydxzbm"];
    query.start = 0;
    query.num = 1000000;
    let result = await masterLandLayer.queryFeatures(query);

    let features = result.features;
    let chartData: [string, number][] = [];
    let allCount = 0;
    let tableData: LandItem[] = [];
    for (let i = 0, len = features.length; i < len; i++) {
      let attributes = features[i].attributes;
      let name: string = attributes.ydxz;
      let nameCode: string = attributes.ydxzbm;
      let count: number = attributes.totalArea
      chartData.push([name, count])
      tableData.push({
        type: name,
        typeCode: nameCode,
        area: Number(count.toFixed(2)),
        percenter: '0%'
      })
      allCount += count;
    }

    // 计算百分比
    for (let j = 0, len = tableData.length; j < len; j++) {
      tableData[j].percenter = (tableData[j].area / allCount * 100).toFixed(1) + '%';
    }

    return {
      chartData,
      chartTitle: String((allCount / 10000).toFixed(2)),
      tableData,
    }
  }

  // 
  function constructorUniqueValueRender(chartData: [string, number][]): UniqueValueRenderer {
    let colors = themeMgr.getThemeColor();
    let render: any = {
      type: "unique-value",
      field: "ydxz",
      defaultSymbol: { type: "simple-fill" },
      uniqueValueInfos: [],
    }
    for (let i = 0, len = chartData.length; i < len; i++) {
      render.uniqueValueInfos.push({
        value: chartData[i][0],
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: colors[i]
        }
      });
    }
    return render;
  }


  /**
   * 查询某一类地块类型下的所有地块
   * @param condition 
   */
  const queryLandItemsOfOnTypeLand = async (condition: string) => {
    const mapView = await viewUtils.isViewReady();
    let masterLandLayer = mapView.map.findLayerById(masterLandLayerId) as FeatureLayer;
    var query = masterLandLayer.createQuery();
    query.where = condition;
    query.outFields = ['ydxz', "ydxzbm", 'dkmj', 'dkbh'];
    let results = await masterLandLayer.queryFeatures(query);

    let features = results.features;
    let allArea = 0;
    let tableData: LandItem[] = [];
    for (let i = 0, len = features.length; i < len; i++) {
      let attributes = features[i].attributes;
      let name: string = attributes.ydxz;
      let nameCode: string = attributes.ydxzbm;
      let area: number = attributes.dkmj;
      let landCode: string = attributes.dkbh;
      tableData.push({
        type: name,
        typeCode: nameCode,
        area: Number(area.toFixed(2)),
        landCode: landCode,
        percenter: '0%'
      })
      allArea += area;
    }
    // 计算百分比
    for (let j = 0, len = tableData.length; j < len; j++) {
      tableData[j].percenter = (tableData[j].area / allArea * 100).toFixed(2) + '%';
    }

    return tableData;
  }

  // 定位到满足条件的土地extent
  const goToLand = async (where) => {
    const mapView = await viewUtils.isViewReady();
    let masterLandLayer = mapView.map.findLayerById(masterLandLayerId) as FeatureLayer;;
    var query = masterLandLayer.createQuery();
    query.where = where;
    let results = await masterLandLayer.queryExtent(query);
    mapView.goTo(results.extent);
  }

  // 高亮满足条件的地块
  const highlightLand = async (where) => {
    const [GraphicsLayer, SimpleFillSymbol] = await jsapi.load(["esri/layers/GraphicsLayer", 'esri/symbols/SimpleFillSymbol']);
    const mapView = await viewUtils.isViewReady();
    let highlightGraphicLayer = mapView.map.findLayerById(masterLandHightlightLayerId) as GraphicsLayer;
    if (!highlightGraphicLayer) {
      highlightGraphicLayer = new GraphicsLayer({
        id: masterLandHightlightLayerId
      });
      mapView.map.add(highlightGraphicLayer);
    }
    let masterLandLayer = mapView.map.findLayerById('masterLandLayer') as FeatureLayer;;
    var query = masterLandLayer.createQuery();
    query.where = where;
    masterLandLayer.queryFeatures(query).then((results) => {
      let features = results.features;
      for (let i = 0, len = features.length; i < len; i++) {
        features[i].symbol = new SimpleFillSymbol({
          color: '#ff0000'
        })
      }
      highlightGraphicLayer.removeAll()
      highlightGraphicLayer.addMany(results.features);
    })
  }

  function pieSelectChanged(params) {
    if (params.isSelected) {
      setActiveLandType(params.name)
      queryLandItemsOfOnTypeLand(`ydxz='${params.name}'`).then((data) => {
        let newLandItems: any = [].concat(landItems);
        newLandItems[params.name] = data;
        setLandItems(newLandItems);
        // goto
        goToLand(`ydxz='${params.name}'`);
        highlightLand(`ydxz='${params.name}'`);
      });
    } else {
      if (params.name === activeLandTypeRef.current) {
        setActiveLandType('')
      }
    }
  }

  function landItemOnClick(landCode) {
    goToLand(`dkbh='${landCode}'`);
    highlightLand(`dkbh='${landCode}'`);
  }


  const constructExcelData = async (tableData) => {
    const mapView = await viewUtils.isViewReady();
    let masterLandLayer = mapView.map.findLayerById('masterLandLayer') as FeatureLayer;
    var query = masterLandLayer.createQuery();
    query.where = '1=1'
    query.outFields = ['ydxz', "ydxzbm", 'dkmj', 'dkbh'];
    // query.orderByFields = ['ydxz'];
    let results = await masterLandLayer.queryFeatures(query);

    let features = results.features;
    // 根据ydxz字段，进行分组
    let groupLands = {};
    for (let i = 0, len = features.length; i < len; i++) {
      let attributes = features[i].attributes;
      let name: string = attributes.ydxz;
      let nameCode: string = attributes.ydxzbm;
      let area: number = attributes.dkmj;
      let landCode: number = attributes.dkbh;
      let itemLandData = {
        type: name,
        typeCode: nameCode,
        area: Number(area.toFixed(2)),
        landCode: landCode,
        percenter: '0%'
      }

      if (groupLands[name]) {
        groupLands[name] = groupLands[name].concat([itemLandData]);
      } else {
        groupLands[name] = [itemLandData]
      }
    }

    // 每组计算每项所占的百分比
    for (let key in groupLands) {
      let allArea = 0;
      let item = groupLands[key];
      for (let i = 0, len = item.length; i < len; i++) {
        allArea += item[i].area;
      }
      for (let i = 0, len = item.length; i < len; i++) {
        item[i].percenter = (item[i].area / allArea * 100).toFixed(2) + '%';
      }
    };

    // 构建成Excel的数据
    let excels: any = {
      fileName: '',
      sheets: [],
    }
    // 总的统计信息
    let totalStatisticSheet = {
      sheetName: '总的统计',
      data: [['用地性质', '面积', '比例']],
    }
    for (let k = 0, len = tableData.length; k < len; k++) {
      totalStatisticSheet.data.push([tableData[k].type, tableData[k].area, tableData[k].percenter])
    }
    excels.sheets.push(totalStatisticSheet);
    //
    for (let key in groupLands) {
      let item = groupLands[key];
      let sheet = {
        sheetName: key,
        data: [['编号', '面积', '比例']],
      }
      for (let j = 0, len = item.length; j < len; j++) {
        sheet.data.push([item[j].landCode, item[j].area, item[j].percenter]);
      }
      excels.sheets.push(sheet);
    };
    return (excels);
  }

  // 导出数据为Excel
  function exportExcel(data) {
    const fileName = data.fileName || 'land.xls';
    const sheets = data.sheets || [];
    const wb = XLSX.utils.book_new();
    sheets.forEach((item, index) => {
      const ws_name = item.sheetName || `Sheet${index + 1}`;
      const ws = XLSX.utils.aoa_to_sheet(item.data);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
    });
    XLSX.writeFile(wb, fileName);
  }



  function renderLandChilds(data) {
    if (data && data.length > 0) {
      const items = data.map((item) => {
        return (
          <div className={styles.item} onClick={() => {
            landItemOnClick(item.landCode);
          }}>
            <span>{item.landCode}</span>
            <span>{item.area}</span>
            <span>{item.percenter}</span>
          </div>
        )
      });
      return items;
    } else {
      return null;
    }

  }

  return (
    <div className={styles['wrapper']}>
      <div className={styles['chartDiv']}>
        <div className={styles.exportExcel} onClick={() => {
          constructExcelData(tableData).then((excels) => {
            exportExcel(excels);
          });
        }}>导出分析表</div>
        {chartData && chartTitle ?
          <LandPieChart
            dataset={chartData}
            title={chartTitle}
            legendSelectChanged={(params) => {
              pieSelectChanged(params)
            }}
            pieSelectChanged={(params) => {
              console.log(activeLandType);
              pieSelectChanged(params)
            }}
            style={{
              height: '100%',
              width: '100%',
            }}
          /> : null}
      </div>

      <div className={styles['table']}>
        <div className={styles.tableHeader}><span>用地性质</span><span>面积</span><span>比例</span></div>
        <div className={styles.tableBody}>
          <Collapse
            accordion={true}
            activeKey={activeLandType}
            onChange={(key) => {
              setActiveLandType(key as string);
              queryLandItemsOfOnTypeLand(`ydxz='${key}'`).then((data) => {
                let newLandItems = [].concat(landItems);
                newLandItems[key as string] = data;
                setLandItems(newLandItems);
              });
            }}
          >
            {tableData ?
              tableData.map((item, index) => {
                return (
                  <Panel
                    header={<div className={styles.item}><span>{item.type}</span><span>{item.area}</span><span>{item.percenter}</span></div>}
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

    </div>
  );
};

export default UplandSummary;
