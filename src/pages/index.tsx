import React, { useEffect, useRef } from 'react';
import { connect, withRouter } from 'umi';
import jsapi from '@/utils/arcgis/jsapi';
import { INIT_MAP } from '../constants/action-types';
// 头部组件
import Header from '@/components/content/header';
import { useEffectOnce } from 'react-use';

import styles from './index.css';


import {wkt2esrijson} from '../module'

const IndexPage = props => {
  const viewDiv = useRef(null);
  useEffectOnce(() => {
    props.dispatch({
      type: INIT_MAP,
      payload: {
        container: viewDiv.current,
      },
    });
  });

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.viewContainer}>
        <div ref={viewDiv} className={styles.viewDiv}>
          <div className={styles.demo} onClick={(e:React.MouseEvent)=>{
            const wkt = 'LINESTRING (30 10, 10 30, 40 40)';
            const geo = wkt2esrijson(wkt);
            var markerSymbol = {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [226, 119, 40],
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2
              }
            };
            var lineSymbol = {
              type: "simple-line", // autocasts as SimpleLineSymbol()
              color: [226, 119, 40],
              width: 4
            };
            jsapi.load(['esri/geometry/Polyline','esri/Graphic']).then(([Polyline,Graphic])=>{
              const point = Polyline.fromJSON(geo);
              console.log(point)
              let gra = new Graphic({
                geometry:point,
                symbol:lineSymbol
              });
              window.agsGlobal.view.graphics.add(gra);
              window.agsGlobal.view.goTo(point);
            });
          }}>demo</div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect()(IndexPage));
