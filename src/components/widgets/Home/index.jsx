import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import { jsapi, geometryUtils, viewUtils } from '@/utils/arcgis';
import home from './images/home.png';
import styles from './index.less';

// 底图切换功能组件
const Home = () => {
  const [loading, setLoading] = useState(true);
  const vmRef = useRef(null);

  useEffect(() => {
    Promise.all([jsapi.load(['esri/widgets/Home/HomeViewModel']), viewUtils.isViewReady()]).then(
      ([[HomeViewModel], view]) => {
        vmRef.current = new HomeViewModel({
          view,
        });
        setLoading(false);
      },
    );
  }, []);

  async function handleResetClick() {
    if (!vmRef.current || vmRef.current.state !== 'ready') {
      return;
    }
    // 如果当前是直接加载的webmap，可利用map initialViewProperties的viewPoint 属性
    // vm.go(vm.view.map.initialViewProperties.viewpoint);

    // 如果是jsapi自己初始化的地图，需要设定初始化的范围
    // const extent = await geometryUtils.jsonToExtent(window.appcfg.jsapiConfig.initialExtent);
    // view.goTo(extent);

    // 获取当前横沥岛初始相机视角作为初始视角
    const view = await viewUtils.isViewReady();
    const [Camera] = await jsapi.load(['esri/Camera']);
    var cam = new Camera({
      heading: 0.00011666747368089258,
      tilt: 61.79468605192405,
      position: {
        x: 12637337.347325528,
        y: 2602597.8664145647,
        z: 245.23175776936114,
        spatialReference: { wkid: 3857 },
      },
    });
    view.goTo(cam);
    // view.watch('camera', newValue => {
    //   console.log(JSON.stringify(newValue.toJSON()));
    // });
  }

  return (
    <div className={styles.wrap}>
      <span
        className={classnames(styles.btn, {
          disabled: loading,
        })}
        onMouseDown={handleResetClick}
        title="初始状态"
      >
        {loading ? <Icon type="loading" /> : <img src={home} alt="" />}
      </span>
    </div>
  );
};
export default Home;
