/**
 * 地图鹰眼组件
 * @author Joker-lee
 * @date 2020-03-06
 */

import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { jsapi } from '@/utils/arcgis';

import './index.less';
// 引入model
import { AppModelState } from '@/models/app';
import { ConnectState, ConnectProps } from '@/models/connect';


interface IOverview extends ConnectProps {
  app: AppModelState;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

const Overview: React.FC<IOverview> = props => {
  const { app, style } = props;

  const viewDiv = useRef(null);

  useEffect(() => {
    if (app.viewLoaded) {
      buildOverview();
    }
  }, [app.viewLoaded]);


  async function buildOverview() {
    const mainView = window.agsGlobal.view;
    const [Map, MapView,Graphic,watchUtils] = await jsapi.load([
      'esri/Map',
      'esri/views/MapView',
      "esri/Graphic",
      "esri/core/watchUtils"
    ]);
    const overviewMap = new Map({
      basemap: 'osm',

    });

    // Create the MapView for overview map
    const mapView = new MapView({
      container: viewDiv.current,
      map: overviewMap,
      constraints: {
        rotationEnabled: false
      }
    });

    // Remove the default widgets
    mapView.ui.components = [];

    mapView.when(function() {
      setup();
    });
    function setup() {
      const extent3Dgraphic = new Graphic({
        geometry: null,
        symbol: {
          type: "simple-fill",
          color: [0, 0, 0, 0.5],
          outline: null
        }
      });
      mapView.graphics.add(extent3Dgraphic);

      watchUtils.init(mainView, "extent", function(extent) {
        // Sync the overview map location
        // whenever the 3d view is stationary
        if (mainView.stationary) {
          mapView
            .goTo({
              center: mainView.center,
              scale:
                mainView.scale *
                2 *
                Math.max(
                  mainView.width / mapView.width,
                  mainView.height / mapView.height
                )
            })
            .catch(function(error) {
              // ignore goto-interrupted errors
              if (error.name != "view:goto-interrupted") {
                console.error(error);
              }
            });
        }

        extent3Dgraphic.geometry = extent;
      });
    }

  }

  return (
    <div className="geomap-widget-overview">
      <div
        ref={viewDiv}
        className="geomap-widget-overview__div"
      >
      </div>
    </div>
  );
};


export default connect(({ app }: ConnectState) => {
  return { app };
})(Overview);
