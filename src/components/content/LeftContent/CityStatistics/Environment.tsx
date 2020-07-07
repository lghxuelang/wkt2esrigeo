import React from 'react';
import { DatePicker } from 'antd';
import TitlePanel from '@/components/containers/titlePanel';
import EnvironmentChart from '@/components/content/LeftContent/charts/EnvironmentChart';
import EnvironmentLine from '@/components/content/LeftContent/charts/EnvironmentLine';
import imgSrc from './images/back.png';
import styles from './index.less';

interface EnvironmentPropTypes {
  backUp: Function
}

const Environment: React.FC<EnvironmentPropTypes> = ({backUp}) => {
  return (
    <TitlePanel
      title={
        <div className={styles.titleWrap}>
          <img alt="" src={imgSrc}  onClick={() => {
                backUp('cityGeneral')
            }}/>
          生态环境
        </div>
      }
      className={styles.wrap}
    >
      <div className={styles.content}>
        <EnvironmentChart
          data={[{}]}
          style={{
            margin: '0 auto',
            height: '240px',
            width: '368px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        />
        <div className={styles.environmentBtns}>
          <button className={styles.active}>AQ1</button>
          <button>PM 2.5</button>
          <button>PM 10</button>
        </div>
        <div className={styles.split} />
        <div className={styles.datePicker}>
          <span className={styles.label}>选择日期</span>
          <DatePicker />
        </div>
        <EnvironmentLine
          data={[{}]}
          style={{
            margin: '0 auto',
            marginTop: '25px',
            height: '240px',
            width: '368px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        />
      </div>
    </TitlePanel>
  );
};

export default Environment;
