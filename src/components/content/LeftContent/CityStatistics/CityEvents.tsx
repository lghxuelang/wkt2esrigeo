import React from 'react';
import TitlePanel from '@/components/containers/titlePanel';
import CityEventsPie from '@/components/content/LeftContent/charts/CityEventsPie';
import imgSrc from './images/back.png';
import styles from './index.less';

interface CityEventsPropTypes {
  backUp: Function
}

const CityEvents: React.FC<CityEventsPropTypes> = ({backUp}) => {
  function renderProgressItems() {
    return (
      <>
        <div className={styles.item}>
          <span className={styles.label}>界面秩序</span>
          <span className={styles.bar} style={{ width: 160 }} />
          <span className={styles.num}>128</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>施工管理</span>
          <span className={styles.bar} style={{ width: 66 }} />
          <span className={styles.num}>64</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>道路交通</span>
          <span className={styles.bar} style={{ width: 234 }} />
          <span className={styles.num}>144</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>专项排查</span>
          <span className={styles.bar} style={{ width: 38 }} />
          <span className={styles.num}>32</span>
        </div>
      </>
    )
  }

  return (
    <TitlePanel
      title={
        <div className={styles.titleWrap}>
          <img alt="" src={imgSrc}  onClick={() => {
                backUp('cityGeneral')
            }}/>
          城市事件
        </div>
      }
      className={styles.wrap}
    >
      <div className={styles.content}>
        <CityEventsPie
          data={[{}]}
          style={{
            margin: '0 auto',
            height: '240px',
            width: '368px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        />
        <div className={styles.eventBtns}>
          <button className={styles.active}>市值班长（结案）</button>
          <button>区接线员（核查）</button>
          <button>市接线员（受理）</button>
          <button>专业部门阶段</button>
          <button>办结</button>
        </div>
        <div className={styles.split} />
        <div className={styles.radioGroup}>
          <span className={styles.active}>全部</span>
          <span>本周</span>
          <span>本月</span>
        </div>
        <div className={styles.progress}>{renderProgressItems()}</div>
      </div>
    </TitlePanel>
  );
};

export default CityEvents;
