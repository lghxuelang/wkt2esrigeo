import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import rainImg from './images/暴雨.png';
import snowImg from './images/暴雪.png';
import rainAndSnowImg from './images/雨夹雪.png';
import sunnyDayImg from './images/晴天.png';
import nightSceneImg from './images/晚间晴天.png';
import RainEffects from '@/components/EffectWidgets/WeatherEffects/RainEffect';
import SnowEffects from '@/components/EffectWidgets/WeatherEffects/SnowEffect';
import WidgetPanel from '@/components/containers/widgetPanel';

const WeatherEffects = ({onClose}) => {

  const [mode, SetMode] = useState('');

  function handleWeatherEffects(e) {
    const weatherTypeParam = e.currentTarget.attributes.weatherType.nodeValue;
    SetMode(weatherTypeParam);
  }

  function renderContent() {
    switch (mode) {
      case 'rain': {
        return <RainEffects/>;
      }
      case 'snow': {
        return <SnowEffects/>;
      }
      case 'rainAndSnow': {
        return (
          <div>
            <RainEffects/>
            <SnowEffects/>
          </div>
        );
      }
      case 'sunnyDay': {
        window.agsGlobal.view.environment = {
          lighting: {
            directShadows: false,
            date: new Date('Sun Mar 15 2015 10:00:00 GMT+0800 (CET)'),
          },
        };
        break;
      }
      case 'nightScene': {
        window.agsGlobal.view.environment = {
          lighting: {
            directShadows: false,
            date: new Date('Sun Mar 15 2015 21:00:00 GMT+0800 (CET)'),
          },
        };
        break;
      }
      default:
        break;
    }
    return null;
  }

  return (
    <WidgetPanel title={'天气特效'} onClose={onClose}>
      <div className={styles.choosebuilddivdiv}>
        <p className={styles.choosebuildP}>
          <div
            className={styles.spanLeft}
            weatherType="rain"
            onClick={handleWeatherEffects}
          >
            <img
              src={rainImg}
              alt="img"
              className={styles.btnImg4panel}
            />
            <span className={styles.span4panel}>雨</span>
          </div>

          <div
            className={styles.spanLeft}
            weatherType="snow"
            onClick={handleWeatherEffects}
          >
            <img
              src={snowImg}
              alt="img"
              className={styles.btnImg4panel}
            />
            <span className={styles.span4panel}>雪</span>
          </div>
          <div
            className={styles.spanLeft}
            weatherType="rainAndSnow"
            onClick={handleWeatherEffects}
          >
            <img
              src={rainAndSnowImg}
              alt="img"
              className={styles.btnImg4panel}
            />
            <span className={styles.span4panel}>雨+雪</span>
          </div>
          <div
            className={styles.spanLeft}
            weatherType="sunnyDay"
            onClick={handleWeatherEffects}
          >
            <img
              src={sunnyDayImg}
              alt="img"
              className={styles.btnImg4panel}
            />
            <span className={styles.span4panel}>晴</span>
          </div>
          <div
            className={styles.spanLeft}
            weatherType="nightScene"
            onClick={handleWeatherEffects}
          >
            <img
              src={nightSceneImg}
              alt="img"
              className={styles.btnImg4panel}
            />
            <span className={styles.span4panel}>夜景</span>
          </div>
        </p>
      </div>
      {renderContent()}

    </WidgetPanel>
  );
};
export default WeatherEffects;
