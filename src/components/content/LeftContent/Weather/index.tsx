import React, { useState } from 'react';
import { useInterval, useBoolean } from 'react-use';
import moment from 'moment';
import StyledPanel from '@/components/containers/styledPanel';

import sunSrc from './images/白天-晴.png';
import styles from './index.less';

export interface WeatherPropTypes {}

moment.locale('zh-cn');
const Weather: React.FC<WeatherPropTypes> = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [delay, setDelay] = useState(1000);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      setNow(new Date());
    },
    isRunning ? delay : null,
  );

  return (
    <StyledPanel className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles.weather}>
          <span className={styles.icon}>
            <img alt="" src={sunSrc} />
          </span>
          <span className={styles.text}>14</span>
          <span className={styles.text2}>℃</span>
        </div>
        <div className={styles.date}>
          {`${moment(now).format('LL')} ${moment(now).format('hh:mm:ss')}`}
        </div>
      </div>
    </StyledPanel>
  );
};

export default Weather;
