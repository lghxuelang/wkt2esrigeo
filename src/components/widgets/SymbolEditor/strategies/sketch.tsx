import React, { FC, useContext, useState } from 'react';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { LayersModelState } from '@/models/layers';
import { EditorContext } from '@/components/widgets/SymbolEditor';
import RenderType from '@/components/widgets/SymbolEditor/renderers/RenderType';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';
import ElevationInfo from '@/components/widgets/SymbolEditor/editors/ElevationInfo';
import SimpleEditor from '@/components/widgets/SymbolEditor/editors/SimpleEditor';
import OpacityEditor from '@/components/widgets/SymbolEditor/editors/OpacityEditor';
import PointRender from '@/components/widgets/SymbolEditor/editors/PointRender';
import ColorEditor from '@/components/widgets/SymbolEditor/editors/ColorEditor';
import GeoSketchRenderer from '@/core/smart-mapping/renderers/GeoSketchRenderer';

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface SketchEditorPropTypes {}

const SketchEditor: FC<SketchEditorPropTypes & ConnectedProps> = ({ layers }) => {
  const {
    renderer: [renderType, setRendererType],
    option: [editOption],
  } = useContext(EditorContext);

  const [pointFillColor, setPointFillColor] = useState('white');
  const [pointOutlineColor, setPointOutlineColor] = useState('#52527a');
  const [lineFillColor, setLineFillColor] = useState('white');
  const [areaFillColor, setAreaFillColor] = useState('white');
  const [areaOutlineColor, setAreaOutlineColor] = useState('#52527a');

  function renderSymbolEditor() {
    return (
      <div className="geomap-widget-symbol-editor__styling">
        <div className="geomap-widget-symbol-editor__styling-title">标绘点符号设置</div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">填充颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={pointFillColor}
              onChange={color => {
                setPointFillColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSketchRenderer;
                  renderer.point.setSymbolPropValue('color', color);
                }
              }}
            />
          </div>
        </div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">轮廓颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={pointOutlineColor}
              onChange={color => {
                setPointOutlineColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSketchRenderer;
                  renderer.point.setSymbolPropValue('outline.color', color);
                }
              }}
            />
          </div>
        </div>
        <div className="geomap-widget-symbol-editor__styling-title">标绘线符号设置</div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">填充颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={lineFillColor}
              onChange={color => {
                setLineFillColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSketchRenderer;
                  renderer.polyline.setSymbolPropValue('color', color);
                }
              }}
            />
          </div>
        </div>
        <div className="geomap-widget-symbol-editor__styling-title">标绘面符号设置</div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">填充颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={areaFillColor}
              onChange={color => {
                setAreaFillColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSketchRenderer;
                  renderer.polygon.setSymbolPropValue('color', color);
                }
              }}
            />
          </div>
        </div>
        <div className="geomap-widget-symbol-editor__styling-row">
          <span className="geomap-widget-symbol-editor__styling-row-label">轮廓颜色</span>
          <div className="geomap-widget-symbol-editor__styling-row-wrap">
            <ColorEditor
              color={areaOutlineColor}
              onChange={color => {
                setAreaOutlineColor(color);
                if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
                  const renderer = layers.currentSymbolEditItem.renderMgr
                    .renderer as GeoSketchRenderer;
                  renderer.polygon.setSymbolPropValue('outline.color', color);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return editOption ? (
    renderSymbolEditor()
  ) : (
    <div className="geomap-widget-symbol-editor__renders">
      <RenderType type={GeoRendererType.Sketch} onSelect={() => {}} />
    </div>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(SketchEditor);
