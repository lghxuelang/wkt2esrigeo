/**
 * The BasemapGallery widget displays a collection images representing basemaps from ArcGIS.com or a user-defined set
 * of map or image services. When a new basemap is selected from the BasemapGallery, the map's basemap
 * layers are removed and replaced with the basemap layers of the associated basemap selected in the gallery. By default,
 * the BasemapGallery widget looks like the following image.
 * @author  Joker_Lee
 *
 * @module esri/widgets/BasemapGallery
 * @since 4.0
 */

import React, { useState } from 'react';
import styles from './index.less';
import { Slider } from 'antd';
import { viewUtils } from '@/utils/arcgis';
import classes from 'classnames';
import WidgetPanel from '@/components/containers/widgetPanel';

const BaseMapGallery = ({ onClose }) => {

  // 设定当前选中的是哪个底图
  const [currentIndex, setCurrentIndex] = useState(window.basemapConfig[2].id);

  const switchBmap = async e => {
    const itemId = e.target.dataset.itemid;
    setCurrentIndex(itemId);
    for (let i = 0; i < window.basemapConfig.length; i++) {
      const item = window.basemapConfig[i];
      if (item.id === itemId) {
        const basemap = await viewUtils.createBasemap(item);
        window.agsGlobal.view.map.basemap = basemap;
      }
    }
  };
  const renderItem = () => {
    return window.basemapConfig.map(item => {
      return (
        <div
          key={item.title}
          className={classes({
            [styles.item]: true,
            [styles.itemActive]: item.id === currentIndex ? true : false,
          })}
        >
          <img
            title={item.title}
            src={item.iconUrl}
            alt=""
            className={styles.icon}
            data-itemid={item.id}
            onClick={switchBmap}
          />
        </div>
      );
    });
  };

  // 透明度滚动条
  function onSliderChange(value) {
    window.agsGlobal.view.map.basemap.baseLayers.items[0].opacity = value / 100;
    window.agsGlobal.view.map.ground.opacity = -(value - 100) / 100;
  }

  return (
    <WidgetPanel title={'底图切换'} onClose={onClose} propStyle={{width:'300px'}}>
      <div className={styles.panel}>
        <div className={styles.container}>{renderItem()}</div>
        <div className={styles.slider}>
          底图透明度
          <Slider marks={{
            100: '100',
            75: '75',
            50: '50',
            25: '25',
            0: '0',
          }} defaultValue={0} onChange={onSliderChange}/>
        </div>
      </div>
    </WidgetPanel>
  );
};

export default BaseMapGallery;
