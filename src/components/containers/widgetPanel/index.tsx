import React from 'react';
import { connect } from 'dva';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';
import TitlePanel from '@/components/containers/styledPanel';
import AutoHeightScroller from '@/components/containers/autoHeightScroller';

interface MapToolbarPropTypes extends ConnectProps {
  title?: JSX.Element | React.Component | string;
  children?: JSX.Element | React.Component;
  propStyle?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClose: Function;
}

const WidgetPanel: React.FC<MapToolbarPropTypes> = props => {
  const { children, title, onClose, propStyle } = props;

  return (
    <div
      className={styles.panelWrap} style={propStyle}
    >
      <div className={styles.panelHead}>
        <span>{title}</span>
        <span onClick={(): void => onClose && onClose()}>
          <CloseOutlined/>
        </span>
      </div>
      {children}
    </div>
  );
};

export default WidgetPanel;
