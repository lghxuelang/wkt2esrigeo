import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import styles from './index.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { ToolbarModelState } from '@/models/toolbar';
import { jsapi, layerUtils } from '@/utils/arcgis';

// interface optServer {
//     mc: "东方文化广场",
//     dh: " "
//     sjly: " "
//     yjl: "商业设施"
//     ejl: "大厦"
//   }

interface LandSpacePropTypes extends ConnectProps {
  toolbar: ToolbarModelState;
}

const LandSpace: React.FC<LandSpacePropTypes> = props => {
  let { toolbar } = props;
  const [dataArr, setDataArr] = useState<Array<any>>([]);
  let highlight;

  useEffect(() => {
    if (toolbar.layerClassify.length > 0) {
      let resultEjl = toolbar.layerClassify.map(d => {
        return { p_name: d.attributes.yjl, c_name: d.attributes.ejl };
      });
      // 将地图中相同父名称的数据进行分类没有去重
      let list = resultEjl,
      flag = 0,
      data: Array<any> = [];
      for (let i = 0; i < list.length; i++) {
        let az = 0;
        for (let j = 0; j < data.length; j++) {
          if (data[j][0].p_name == list[i].p_name) {
            flag = 1;
            az = j;
            break;
          }
        }
        if (flag == 1) {
          data[az].push(list[i]);
          flag = 0;
        } else if (flag == 0) {
          let wdy = new Array();
          wdy.push(list[i]);
          data.push(wdy);
        }
      }
      // 对分类后的数据进行父元素下子元素的去重分类统计
      let datafinal: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let dataEjl = data[i].map(d => {
          return d.c_name;
        });
        let ejlObj = arrayCnt(dataEjl);
        datafinal.push({ yjl: data[i][0].p_name, value: dataEjl.length, ejl: ejlObj });
      }
      setDataArr(datafinal);
    }
  }, [toolbar.layerClassify]);

  // 去重顺便归类，统计出同一个的个数有多少
  function arrayCnt(arr) {
    let newArr: Array<any> = [];
    let newArrObj: Array<any> = [];
    //使用set进行数组去重
    newArr = [...new Set(arr)];
    let newarr2 = new Array(newArr.length);
    for (let t = 0; t < newarr2.length; t++) {
      newarr2[t] = 0;
    }
    for (let p = 0; p < newArr.length; p++) {
      for (let j = 0; j < arr.length; j++) {
        if (newArr[p] == arr[j]) {
          newarr2[p]++;
        }
      }
    }
    for (let m = 0; m < newArr.length; m++) {
      newArrObj.push({ name: newArr[m], num: newarr2[m] });
    }
    return newArrObj;
  }

  function yjlClick(oneItem) {
    console.log(oneItem)
  }

  async function ejlClick (item) {
    const [Query] = await jsapi.load(['esri/tasks/support/Query']);
    const lyr = layerUtils.getLayerByTitle(window.agsGlobal?window.agsGlobal.view:null, 'Feature Service3');
    const query = new Query();
    query.where = "ejl='"+item.name+"'"
    query.returnGeometry = true;
    query.outFields = ["*"];
    if(lyr && window.agsGlobal){
      window.agsGlobal.view.whenLayerView(lyr).then(bimLyrView => {
      lyr.queryFeatures(query).then((response)=>{
           if (highlight) {
            highlight.remove();
          }
          highlight = bimLyrView.highlight(response.features);
      });
      lyr.queryExtent(query).then(result => {
        if (result.extent && window.agsGlobal) {
          window.agsGlobal.view.goTo(result.extent.expand(1.5));
        }
      });
    })
    }
  }

  return (
    <div className={styles.landSpace}>
      {dataArr
        ? dataArr.map((oneItem, index1) => {
            let childType = oneItem.ejl.map((item, index2) => {
              return (
                <div className={styles.itemBody} key={index1 + '_' + index2} onClick={()=>{ejlClick(item)}}>
                  <span>{item.name}</span>
                  <span>{item.num}</span>
                </div>
              );
            });
            return (
              <>
                <div className={styles.itemHeader} key={index1} onClick={()=>{yjlClick(oneItem)}}>
                  <span>{oneItem.yjl}</span>
                  <span>{oneItem.value}</span>
                </div>
                {childType}
              </>
            );
          })
        : ''}
    </div>
  );
};

export default connect(({ toolbar }: ConnectState) => {
  return { toolbar };
})(LandSpace);
