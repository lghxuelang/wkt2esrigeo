import React, { Children } from 'react';

import StyledPanel from '../styledPanel';
import AutoHeightScroller from '../autoHeightScroller';
// import CloseSquareOutlined from '@ant-design/icons/CloseSquareOutlined'


import styles from './index.less';

interface TitlePanelPropTypes {
  title?: JSX.Element | React.Component | string;
  children?: JSX.Element | React.Component;
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClose?: ()=>void|boolean;
}

const TitlePanel: React.FC<TitlePanelPropTypes> = ({ title, children, className, style, onClose }) => {
  return (
    <StyledPanel className={className} style={style}>
      <div className={styles.wrap}>
        <div className={styles.title}>
          {title}
          {/*{onClose && <CloseSquareOutlined className={styles.close} onClick={onClose}/>}*/}
        </div>
        <AutoHeightScroller>{children}</AutoHeightScroller>
      </div>
    </StyledPanel>
  );
};

export default TitlePanel;
