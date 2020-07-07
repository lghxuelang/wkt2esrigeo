import React, { useContext } from 'react';
import { connect } from 'umi';
import ElevationInfo from '../editors/ElevationInfo';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import SimpleEditor from '@/components/widgets/SymbolEditor/editors/SimpleEditor';
import OpacityEditor from '@/components/widgets/SymbolEditor/editors/OpacityEditor';
import RenderType from '@/components/widgets/SymbolEditor/renderers/RenderType';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import { EditorContext } from '../index';
import PointRender from '@/components/widgets/SymbolEditor/editors/PointRender';
import PolygonRender from '@/components/widgets/SymbolEditor/editors/WaterEditor';
import GeoSimpleRenderer from '@/core/smart-mapping/renderers/GeoSimpleRenderer';
import GeoWaterRenderer from '@/core/smart-mapping/renderers/GeoWaterRenderer';
import LayerFieldSelect from '@/components/widgets/SymbolEditor/editors/LayerFieldSelect';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface FeatureEditorPropTypes {}

const FeatureEditor: React.FC<FeatureEditorPropTypes & ConnectedProps> = ({ layers }) => {
  const {
    renderer: [renderType, setRendererType],
    option: [editOption],
  } = useContext(EditorContext);

  function renderSymbolEditor() {
    switch (renderType) {
      case GeoRendererType.Simple: {
        return (
          <>
            <ElevationInfo />
            <SimpleEditor />
            <OpacityEditor />
            <PointRender />
          </>
        );
      }
      case GeoRendererType.Water: {
        return (
          <>
            <PolygonRender />
          </>
        );
      }
      default:
        break;
    }
    return null;
  }

  function renderLayerWithSimple() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      if (!layers.currentSymbolEditItem.renderMgr.hasRendererCache(GeoRendererType.Simple)) {
        layers.currentSymbolEditItem.renderMgr.setRenderer(
          GeoRendererType.Simple,
          new GeoSimpleRenderer(layers.currentSymbolEditItem.renderMgr.layer),
        );
      } else {
        layers.currentSymbolEditItem.renderMgr.switchRenderer(GeoRendererType.Simple);
      }

      layers.currentSymbolEditItem.renderMgr.renderToLayer();
    }
  }

  function renderPointWithBillboard() {}

  function renderPolygonWithWater() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      if (!layers.currentSymbolEditItem.renderMgr.hasRendererCache(GeoRendererType.Water)) {
        layers.currentSymbolEditItem.renderMgr.setRenderer(
          GeoRendererType.Water,
          new GeoWaterRenderer(layers.currentSymbolEditItem.renderMgr.layer),
        );
      } else {
        layers.currentSymbolEditItem.renderMgr.switchRenderer(GeoRendererType.Water);
      }

      layers.currentSymbolEditItem.renderMgr.renderToLayer();
    }
  }

  function renderPointEditor() {
    if (!editOption) {
      return (
        <div className="geomap-widget-symbol-editor__renders">
          <LayerFieldSelect mode={'single'} />
          <RenderType
            type={GeoRendererType.Simple}
            geometryType={'point'}
            onSelect={() => {
              if (renderType !== GeoRendererType.Simple) {
                setRendererType(GeoRendererType.Simple);
              }

              renderLayerWithSimple();
            }}
          />
          <RenderType
            type={GeoRendererType.UniqueValue}
            geometryType={'point'}
            onSelect={() => {
              setRendererType(GeoRendererType.UniqueValue);
            }}
          />
          <RenderType
            type={GeoRendererType.ClassBreak}
            geometryType={'point'}
            onSelect={() => {
              setRendererType(GeoRendererType.ClassBreak);
            }}
          />
          <RenderType type={GeoRendererType.Billboard} onSelect={() => {}} />
        </div>
      );
    }

    return renderSymbolEditor();
  }

  function renderPolylineEditor() {
    if (!editOption) {
      return (
        <div className="geomap-widget-symbol-editor__renders">
          <LayerFieldSelect mode={'single'} />
          <RenderType
            type={GeoRendererType.Simple}
            geometryType={'polyline'}
            onSelect={() => {
              if (renderType !== GeoRendererType.Simple) {
                setRendererType(GeoRendererType.Simple);
              }

              renderLayerWithSimple();
            }}
          />
          <RenderType
            type={GeoRendererType.UniqueValue}
            geometryType={'polyline'}
            onSelect={() => {
              setRendererType(GeoRendererType.UniqueValue);
            }}
          />
          <RenderType
            type={GeoRendererType.ClassBreak}
            geometryType={'polyline'}
            onSelect={() => {
              setRendererType(GeoRendererType.ClassBreak);
            }}
          />
        </div>
      );
    }

    return renderSymbolEditor();
  }

  function renderPolygonEditor() {
    if (!editOption) {
      return (
        <div className="geomap-widget-symbol-editor__renders">
          <LayerFieldSelect mode={'single'} />
          <RenderType
            type={GeoRendererType.Simple}
            geometryType={'polygon'}
            onSelect={() => {
              if (renderType !== GeoRendererType.Simple) {
                setRendererType(GeoRendererType.Simple);
              }

              renderLayerWithSimple();
            }}
          />
          <RenderType
            type={GeoRendererType.UniqueValue}
            geometryType={'polygon'}
            onSelect={() => {
              setRendererType(GeoRendererType.UniqueValue);
            }}
          />
          <RenderType
            type={GeoRendererType.ClassBreak}
            geometryType={'polygon'}
            onSelect={() => {
              setRendererType(GeoRendererType.ClassBreak);
            }}
          />
          <RenderType
            type={GeoRendererType.Water}
            onSelect={() => {
              if (renderType !== GeoRendererType.Water) {
                setRendererType(GeoRendererType.Water);
              }

              renderPolygonWithWater();
            }}
          />
        </div>
      );
    }

    return renderSymbolEditor();
  }

  function render() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.layer) {
      switch (layers.currentSymbolEditItem.layer.geometryType) {
        case 'point': {
          return renderPointEditor();
        }
        case 'polyline': {
          return renderPolylineEditor();
        }
        case 'polygon': {
          return renderPolygonEditor();
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
})(FeatureEditor);
