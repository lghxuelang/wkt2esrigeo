import React from 'react';
import { connect } from 'umi';
import Weather from './weather';
import CityStatis from './CityStatistics';
import CityEvents from '@/components/content/LeftContent/CityStatistics/CityEvents';
import Environment from '@/components/content/LeftContent/CityStatistics/Environment';
import LandStasis from './LandStatistics';
import ConstructionPlan from '@/components/content/LeftContent/ConstructionPlan';
import { ConnectState, ConnectProps } from '@/models/connect';
import { ToolbarModelState } from '@/models/toolbar';
import CityDesign from '@/components/content/LeftContent/CityDesign';

import styles from './index.less';

interface LeftContentPropTypes extends ConnectProps {
  toolbar: ToolbarModelState;
}

const LeftContent: React.FC<LeftContentPropTypes> = props => {
  const { toolbar } = props;
  function renderContent(): JSX.Element | JSX.Element[] {
    switch (toolbar.activeToolbar) {
      case 'city': {
        return <CityStatis />;
        // return <Environment />;
      }
      case 'land': {
        return <LandStasis />;
      }
      case 'plan': {
        return <ConstructionPlan />;
      }
      case 'urban': {
        return <CityDesign/>
      }
      default:
        break;
    }
    return <div></div>;
  }

  return (
    <div className={styles.wrap}>
      <React.Fragment>
        <Weather />
        {renderContent()}
      </React.Fragment>
    </div>
  );
};

export default connect(({ toolbar }: ConnectState) => {
  return { toolbar };
})(LeftContent);
