import { useEffect, useState } from 'react';
import jsapi from '@/utils/arcgis/jsapi';
import { connect } from 'dva';

let gpMixin;

const GPWidget = ({ app, style, url }) => {
  const [initialized, updateInitialized] = useState(false);

  useEffect(() => {
    if (!app.viewLoaded) return;

    jsapi
      .load(['agsextend/GeoprocessViewModel', 'agsextend/GeoprocessViewMixin'])
      .then(([GPWidgetViewModel, GPWidgetViewMixin]) => {
        // init mixin and event listeners
        const gpViewModel = new GPWidgetViewModel({
          portalUrl: 'https://www.arcgis.com/',
          view: window.agsGlobal.view,
          taskUrl:
            'https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot',
          analysisLayers: [],
          portalSelf: null,
        });
        window.gpVm = gpViewModel;

        gpMixin = new GPWidgetViewMixin({
          analysisMode: 'standard',
          viewModel: gpViewModel,
          shouldAddToMap: !1,
          // showReadyToUseLayers: g.showReadyToUseLayers,
          // showBrowseLayers: g.showBrowseLayers,
          // showCredits: g.showCredits,
          useArcGISComponents: !0,
        });
        window.gpMix = gpMixin;

        updateInitialized(true);
      });
  }, [app.viewLoaded]);

  function onExecute() {
    if (gpMixin) {
      gpMixin._handleSaveBtnClick();
    }
  }

  return (
    <div style={style}>
      <button
        disabled={!initialized}
        style={{
          height: 40,
          width: 120,
          border: '1px solid white',
          background: 'rgba(0,0,0,0.3)',
          color: 'white',
        }}
        onClick={onExecute}
      >
        Execute GP
      </button>
    </div>
  );
};

export default connect(({ app }) => ({ app }))(GPWidget);
