// 罗盘微件
import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

import { jsapi, viewUtils } from '@/utils/arcgis';
import zhibeizhen from './images/compass.png'

function toRotationTransform(orientation) {
  return {
    display: 'inline-block',
    fontSize: '24px',
    transform: `rotateZ(${orientation.z}deg)`,
  };
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [vm, setVm] = useState(null);
  const [orientation, setorientation] = useState({ z: 0 });

  useEffect(() => {
    Promise.all([jsapi.load(['esri/widgets/Compass/CompassViewModel']), viewUtils.isViewReady()]).then(
      ([[CompassViewModel]]) => {
        const vm = new CompassViewModel({
          view: window.agsGlobal.view,
        });
        vm.watch('orientation', orientation => {
          setorientation(orientation);
        });
        setLoading(false);
        setVm(vm);
      },
    );

  }, []);

  function reset() {
    if (!vm) {
      return;
    }

    vm.reset();
  }

  return (
    <div>
      <span
        className={classnames({
          disabled: loading,
        })}
        onMouseDown={reset}
        title="指南针"
      >
        {loading ? (
          <Icon type="loading" />
        ) : (
          <img src={zhibeizhen} style={toRotationTransform(orientation)} alt=""/>
        )}
      </span>
    </div>
  );
};
