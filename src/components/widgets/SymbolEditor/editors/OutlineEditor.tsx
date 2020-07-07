import React, { FC } from 'react';
import { connect } from 'umi';
import _ from 'lodash';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import NumberValueEditor from '@/components/widgets/SymbolEditor/editors/NumberValueEditor';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import GeoSimpleRenderer from '@/core/smart-mapping/renderers/GeoSimpleRenderer';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

const OutlineEditor: FC<ConnectedProps> = ({ layers }) => {
  function getCurrentWidthValue() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const { renderer, currentType } = layers.currentSymbolEditItem.renderMgr;
      if (currentType !== GeoRendererType.Unknown) {
        switch (currentType) {
          case GeoRendererType.Simple: {
            const simpleFSRender = renderer as GeoSimpleRenderer;
            if (simpleFSRender) {
              const current =
                simpleFSRender.symbol3D && _.get(simpleFSRender.symbol3D.current, 'outline.width');
              const server =
                simpleFSRender.symbol3D && _.get(simpleFSRender.symbol3D.server, 'outline.width');
              return current || server || 1;
            }
          }
          default:
            break;
        }
      }
    }

    return 1;
  }

  function changeLayerWidth(width: number) {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      const { renderer, currentType } = layers.currentSymbolEditItem.renderMgr;
      if (currentType !== GeoRendererType.Unknown) {
        switch (currentType) {
          case GeoRendererType.Simple: {
            const simpleFSRender = renderer as GeoSimpleRenderer;
            if (simpleFSRender) {
              simpleFSRender.setPropValue('outline.width', width);
            }
            break;
          }
          default:
            break;
        }
      }
    }
  }

  return <NumberValueEditor max={150} value={getCurrentWidthValue()} onChange={changeLayerWidth} />;
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(OutlineEditor);
