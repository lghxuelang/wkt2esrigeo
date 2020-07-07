/* eslint-disable no-unused-expressions */
import { connect } from 'dva';
import Overview from '@/components/widgets/Overview';
import Eyeview from '@/components/widgets/Eyeview';
import LightshadowPanel from '@/components/AnalysisWidgets/Daylight';
import Slice from '@/components/AnalysisWidgets/Slice';
import roamByHeading from '@/components/widgets/Overlook';
import BookmarkPanel from '@/components/widgets/Bookmarks/BookmarkPanel';
import Measurement3D from '@/components/AnalysisWidgets/Measurement3D';
import LineOfSight from '@/components/AnalysisWidgets/LineOfSight';
import Screenshot from '@/components/widgets/Screenshot';
import DroneFlay from '@/components/EffectWidgets/DroneFly/index.js';
import WeatherEffects from '@/components/EffectWidgets/WeatherEffects';
import BaseMapGallery from '@/components/widgets/BasemapGallery';
import LayerCatalog from '@/components/widgets/LayerCatalog';
import TitlePanel from '@/components/containers/titlePanel';
import TOC from './TOC';
import React from 'react';
import styles from './index.less';
import Sketch3D from '@/components/widgets/Sketch3D';

const RightContent = ({ dispatch, maptoolbar }) => {
  const handleCloseClick = () => {
    dispatch({
      type: 'maptoolbar/updataActiveToolbar',
      payload: '',
    });
  };

  function renderContent() {
    switch (maptoolbar.activeToolbar) {
      case 'plotting': {
        return <Sketch3D />;
      }
      case 'daylight': {
        return <LightshadowPanel onClose={handleCloseClick} />;
      }
      case 'measure': {
        return <Measurement3D onClose={handleCloseClick} />;
      }
      case 'slice': {
        return <Slice onClose={handleCloseClick} />;
      }
      case 'lineofsight': {
        return <LineOfSight onClose={handleCloseClick} />;
      }
      case 'overview': {
        return <Overview />;
      }
      case 'bookmark': {
        return <BookmarkPanel onClose={handleCloseClick} />;
      }
      case 'screenshot': {
        return <Screenshot onClose={handleCloseClick} />;
      }
      case 'weatherEffect': {
        return <WeatherEffects onClose={handleCloseClick} />;
      }
      case 'eyeview': {
        const eyeview = new Eyeview({});
        eyeview.active();
        break;
      }
      case 'overlook': {
        roamByHeading(window.agsGlobal.view);
        break;
      }
      case 'dronefly': {
        return <DroneFlay view={window.agsGlobal.view} />;
      }
      case 'basemapGallery': {
        return <BaseMapGallery onClose={handleCloseClick} />;
      }

      default:
        break;
    }
    return null;
  }

  return renderContent();
};

export default connect(({ maptoolbar }) => {
  return { maptoolbar };
})(RightContent);
