import React, { useState } from 'react';
import { connect } from 'dva';
import classes from 'classnames';
import _ from 'lodash';
import styles from './index.less';
import { Tooltip } from 'antd';
import { Dispatch } from 'redux';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';

interface MapToolbarPropTypes extends ConnectProps {
  maptoolbar: MaptoolbarModelState;
  dispatch: Dispatch;
}

const MapToolbar: React.FC<MapToolbarPropTypes> = props => {
  const [expand, setExpand] = useState(false);

  const { dispatch, maptoolbar } = props;
  const changeToolbarActive = (e: any) => {
    let payload = e.currentTarget.dataset.btn;
    // 更新当前触发的地图组件
    dispatch({
      type: 'maptoolbar/updataActiveToolbar',
      payload: payload === maptoolbar.activeToolbar ? '' : payload,
    });
  };

  const listItems = [
    { title: '服务列表', data: 'catalog' },
    { title: '标绘', data: 'plotting' },
    { title: '书签', data: 'bookmark' },
    { title: '日光', data: 'daylight' },
    { title: '测量', data: 'measure' },
    { title: '鹰眼', data: 'overview' },
    { title: '人视角', data: 'eyeview' },
    { title: '环视', data: 'overlook' },
    { title: '剖切分析', data: 'slice' },
    { title: '视线分析', data: 'lineofsight' },
    { title: '截屏', data: 'screenshot' },
    { title: '无人机', data: 'dronefly' },
    { title: '天气', data: 'weatherEffect' },
    { title: '底图库', data: 'basemapGallery' },
  ];

  return (
    <div className={styles.toolbar}>
      {_.take(listItems, 4).map(item => {
        return (
          <Tooltip key={item.data} placement="left" title={item.title}>
            <div
              className={classes(styles.item, styles[item.data])}
              data-btn={item.data}
              onClick={changeToolbarActive}
            ></div>
          </Tooltip>
        );
      })}
      <div
        className={styles.toggle}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        {expand ? <UpOutlined /> : <DownOutlined />}
      </div>
      {expand
        ? _.slice(listItems, 4).map(item => {
            return (
              <Tooltip key={item.data} placement="left" title={item.title}>
                <div
                  className={classes(styles.item, 'animated fadeIn', styles[item.data])}
                  data-btn={item.data}
                  onClick={changeToolbarActive}
                ></div>
              </Tooltip>
            );
          })
        : null}
    </div>
  );
};

export default connect(({ maptoolbar }: ConnectState) => {
  return {
    maptoolbar,
  };
})(MapToolbar);
