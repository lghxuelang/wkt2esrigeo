/**
 * 三维测量样式面板
 * @author wangxd
 */
import React, { useState } from 'react';
import MeasureLine3D from './DirectLineMeasurement3D';
import MeasureArea3D from './AreaMeasurement3D';
import WidgetPanel from '@/components/containers/widgetPanel';
// 引入model
import { ConnectProps } from '@/models/connect';
import styles from './index.css';
import line from './images/距离测量.png';
import line1 from './images/距离测量1.png';
import area from './images/面积测量.png';
import area1 from './images/面积测量1.png';

interface MeasurePanelPropTypes extends ConnectProps {
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClose: Function;
}

const Measurement3D: React.FC<MeasurePanelPropTypes> = props => {
  const [measureModel, setMeasureModel] = useState<any>('line');
  const { onClose } = props;

  function lineMeasure() {
    setMeasureModel('line');
  }

  function areaMeasure() {
    setMeasureModel('area');
  }

  return (
    <WidgetPanel onClose={onClose} title={'三维测量'}>
      <div>
        <div className={styles.switchButton}>
          <div className={styles.switchRadio}>
          <span
            className={
              measureModel === 'line' ? styles.switchRadioSpan1 : styles.switchRadioSpan2
            }
            onClick={lineMeasure}
          >
            <img
              className={styles.imgIcon}
              src={measureModel === 'line' ? line1 : line}
              alt=""
            />
          </span>
            <span
              className={
                measureModel === 'area' ? styles.switchRadioSpan1 : styles.switchRadioSpan2
              }
              onClick={areaMeasure}
            >
            <img
              className={styles.imgIcon}
              src={measureModel === 'area' ? area1 : area}
              alt=""
            />
          </span>
          </div>
        </div>
        <div className={styles.panelContent}>{
          measureModel == 'line' ? <MeasureLine3D/> : <MeasureArea3D/>
        }</div>
      </div>
    </WidgetPanel>

  );
};

export default Measurement3D;

