import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import bannermiddle from './images/底边中.png';
import bannerLeft from './images/底边左.png';
import bannerRight from './images/底边右.png';
import classnames from 'classnames';
import { layerCreator, viewUtils } from '@/utils/arcgis';

const Toolbar = ({ dispatch, toolbar }) => {
  const changeToolbarActive = async e => {
    const payload = e.currentTarget.dataset.btn;
    dispatch({
      type: 'toolbar/updataActiveToolbar',
      payload,
    });
    const opt = {
      title: '控规_地块——201411',
      type: 'Feature Service',
      url: 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/%E6%8E%A7%E8%A7%84_%E5%9C%B0%E5%9D%97_201411/FeatureServer/0',
    };
    const lyr = await layerCreator.create(opt);
    const viewmap = await viewUtils.isViewReady();
    viewmap.map.add(lyr);
  };

  const listItems = [
    { title: '城市要素', data: 'city' },
    { title: '土地地块', data: 'land' },
    { title: '城市设计', data: 'plan' },
    { title: '城市规划', data: 'urban' },
    { title: '工程建设', data: 'bim' },
    { title: '运营管理', data: 'smart' },
  ];

  // const listItems = [
  //   { title: '城市概况', data: 'city' },
  //   { title: '土地地块', data: 'land' },
  //   { title: '建设计划', data: 'plan' },
  //   { title: '城市规划', data: 'urban' },
  //   { title: '绿色建筑', data: 'green' },
  //   { title: '智慧土地', data: 'smart' },
  //   { title: 'BIM报建', data: 'bim' },
  // ];

  return (
    <div className={styles['wapper']}>
      <img src={bannerLeft} alt="" className={styles.banner}/>
      <img src={bannermiddle} alt=""/>
      <img src={bannerRight} alt="" className={styles.banner}/>
      <div className={styles.toolbar}>
        {listItems.map(item => {
          return (
            <div
              className={toolbar.activeToolbar === item.data ? styles.active : ''}
              data-btn={item.data}
              onClick={changeToolbarActive}
            >
              <div className={classnames(styles.item, styles[item.data])}></div>
              <span>{item.title}</span>
            </div>
          );
        })}
      </div>
      {/*<div className={styles.model}>*/}
      {/*  <span className={styles.active}>建筑白膜</span>*/}
      {/*  <span>实景模型</span>*/}
      {/*</div>*/}
    </div>
  );
};
export default connect(({ toolbar }) => {
  return {
    toolbar,
  };
})(Toolbar);
