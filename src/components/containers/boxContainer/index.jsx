import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import headerImg from './images/header.png';
import footerImg from './images/footer.png';
const BoxContainer = ({ children, param }) => {
  return (
    <div className={styles.wapper} style={param}>
      <img src={headerImg} alt="" className={styles.headerImg} />
      <img src={footerImg} alt="" className={styles.footerImg} />
      {children}
    </div>
  );
};

export default connect(({ toolbar }) => {
  return {
    toolbar,
  };
})(BoxContainer);
