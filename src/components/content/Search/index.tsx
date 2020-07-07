import React from 'react';
import { connect } from 'umi';
import { Input } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import imgSrc from './images/search.png';
import styles from './index.less';

interface SearchProps extends ConnectProps {}

const Search: React.FC<SearchProps> = props => {
  return (
    <div className={styles.wrap}>
      <div className={styles.inputWrap}>
        <img src={imgSrc} alt="" />
        <Input placeholder={'请输入关键词'} />
      </div>
    </div>
  );
};

export  default  Search;
// export default connect(({ app }: ConnectState) => {
//   return { app };
// })(Search);
