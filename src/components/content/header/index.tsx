import React from 'react'
import styles from './index.less'
import bannermiddle from './images/标题-中.png'
import bannerLeft from './images/标题-左.png'
import bannerRight from './images/标题-右.png'

export interface HeaderPropTypes {}
const Header: React.SFC<HeaderPropTypes> = () => {
  return (
    <div className={styles['wapper']}>
      <img src={bannerLeft} alt="" className={styles.banner} />
      <img src={bannermiddle} alt="" />
      <img src={bannerRight} alt="" className={styles.banner} />
    </div>
  );
};
export default Header;
