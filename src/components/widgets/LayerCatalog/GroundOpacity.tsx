import React, { useState } from 'react';
import { Slider, Switch } from 'antd';
import imgSrc from './images/basemap.png';

export interface GroundOpacityPropTypes {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

const GroundOpacity: React.FC<GroundOpacityPropTypes> = () => {
  const [value, setValue] = useState<number>(100);

  function handleGroundOpacityChange(val) {
    setValue(val);
    // TODO: change active view ground opacity
  }

  function handleBasemap(onOrOff: boolean): void {
    // TODO: change active view basemap
  }

  return (
    <div className="geomap-widget-ground-opacity">
      <div className="geomap-widget-ground-opacity__title">
        <img alt="" src={imgSrc} style={{ marginRight: 15 }} /> 底图
      </div>
      <div className="geomap-widget-ground-opacity__slider">
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={val => {
            handleGroundOpacityChange(+val);
          }}
        />
      </div>
      <div className="geomap-widget-ground-opacity__switch">
        <Switch
          size={'small'}
          defaultChecked
          onClick={checked => {
            handleBasemap(checked);
          }}
        />
      </div>
    </div>
  );
};

export default GroundOpacity;
