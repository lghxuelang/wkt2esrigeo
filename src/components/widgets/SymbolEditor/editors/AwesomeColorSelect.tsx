import React from 'react';
import _ from 'lodash';
import { AwesomeColors } from '@/constants/colors';
import './color-palatte.less';

const AwesomeColorSelect = () => {
  function renderColorItems(colors) {
    return _.map(colors, (c, i) => {
      return (
        <div className="geomap-widget-colors__item" key={i}>
          <div
            className="swatch-item"
            style={{
              backgroundColor: c,
            }}
          />
        </div>
      );
    });
  }

  return (
    <>
      <div className="geomap-widget-colors__row">{renderColorItems(_.take(AwesomeColors, 8))}</div>
      <div className="geomap-widget-colors__row">{renderColorItems(_.slice(AwesomeColors, 8))}</div>
    </>
  );
};

export default AwesomeColorSelect;
