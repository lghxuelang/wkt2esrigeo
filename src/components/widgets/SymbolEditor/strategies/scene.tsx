import React, { FC, useContext } from 'react';
import { EditorContext } from '../index';
import { connect } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import RenderType from '@/components/widgets/SymbolEditor/renderers/RenderType';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import EdgeRenderEditor from '@/components/widgets/SymbolEditor/editors/EdgeRenderEditor';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

const SceneEditor: FC<ConnectedProps> = ({ layers }) => {
  const {
    renderer: [renderType],
    option: [editOption],
  } = useContext(EditorContext);

  function renderSymbolEditor() {
    switch (renderType) {
      case GeoRendererType.SceneWhite: {
        return (
          <div className="geomap-widget-symbol-editor__styling">
            <div className="geomap-widget-symbol-editor__styling-title">符号设置</div>
            <EdgeRenderEditor />
          </div>
        );
      }
      default:
        break;
    }

    return null;
  }

  function render3DObjectEditor() {
    if (!editOption) {
      return (
        <>
          <RenderType type={GeoRendererType.SceneWhite} onSelect={() => {}} />
          <RenderType type={GeoRendererType.SceneMaterial} onSelect={() => {}} canEdit={false} />
        </>
      );
    }

    return renderSymbolEditor();
  }

  function render3DPointEditor() {
    return renderSymbolEditor();
  }

  function render() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
      switch (layers.currentSymbolEditItem.layer.geometryType) {
        case 'point': {
          return render3DPointEditor();
        }
        case 'mesh': {
          return render3DObjectEditor();
        }
        default:
          break;
      }
    }
    return null;
  }

  return render();
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(SceneEditor);
