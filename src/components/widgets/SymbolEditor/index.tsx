import React, { useState } from 'react';
import { LeftOutlined, PictureOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import AutoHeightScroller from '@/components/containers/autoHeightScroller';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LayersModelState } from '@/models/layers';
import editComposite from './editor-composite';
import './index.less';
import { GeoRendererType } from '@/core/data-source/GeoRenderer';

export const EditorContext = React.createContext<any>(null);

interface ConnectedProps extends ConnectProps {
  layers: LayersModelState;
}

export interface SymbolEditorPropTypes {}

const SymbolEditor: React.FC<SymbolEditorPropTypes & ConnectedProps> = ({ dispatch, layers }) => {
  function readCurrentLayerRenderType() {
    if (layers.currentSymbolEditItem && layers.currentSymbolEditItem.renderMgr) {
      return layers.currentSymbolEditItem.renderMgr.currentType;
    }

    return GeoRendererType.Simple;
  }

  const [renderType, setRenderType] = useState<GeoRendererType>(readCurrentLayerRenderType());
  const [editOptions, setEditOptions] = useState(false);

  const store = {
    renderer: [renderType, setRenderType],
    option: [editOptions, setEditOptions],
  };

  function renderHeader() {
    const { currentSymbolEditItem } = layers;
    const editTitle = editOptions
      ? layers.currentSymbolEditItem &&
        layers.currentSymbolEditItem.renderMgr &&
        layers.currentSymbolEditItem.renderMgr.renderer &&
        layers.currentSymbolEditItem.renderMgr.renderer.desc
      : null;

    return (
      <div className="geomap-widget-symbol-editor__header">
        <span
          className="geomap-widget-symbol-editor__header-cancel"
          onClick={() => {
            if (editOptions) {
              setEditOptions(false);
              return;
            }

            if (dispatch) {
              dispatch({
                type: 'layers/cancelEditSymbol',
              });
            }
          }}
        >
          <LeftOutlined />
        </span>
        <div className="geomap-widget-symbol-editor__header-text">
          <div>图层符号系统</div>
          <div>{editTitle}</div>
        </div>
      </div>
    );
  }

  function renderFooter() {
    return (
      <div className="geomap-widget-symbol-editor__footer">
        <button
          onClick={() => {
            if (dispatch) {
              dispatch({
                type: 'layers/completeEditSymbol',
              });
            }
          }}
        >
          保存设置
        </button>
      </div>
    );
  }

  function renderTitleEditor() {
    const { currentSymbolEditItem } = layers;

    return (
      <>
        <div className="geomap-widget-symbol-editor__title-text">
          {currentSymbolEditItem && currentSymbolEditItem.getTitle()}
        </div>
        <div
          className="geomap-widget-symbol-editor__title-zoom"
          onClick={() => {
            if (currentSymbolEditItem) {
              currentSymbolEditItem.gotoFullExtent();
            }
          }}
        >
          <PictureOutlined />
        </div>
      </>
    );
  }

  function renderLayerEditor() {
    const { currentSymbolEditItem } = layers;

    if (currentSymbolEditItem && currentSymbolEditItem.layer) {
      return editComposite.render(currentSymbolEditItem.layer.type, currentSymbolEditItem);
    }

    return null;
  }

  return (
    <EditorContext.Provider value={store}>
      <div className="geomap-widget-symbol-editor">
        {renderHeader()}
        <div className="geomap-widget-symbol-editor__title">{renderTitleEditor()}</div>
        <div className="geomap-widget-symbol-editor__content">{renderLayerEditor()}</div>
        {renderFooter()}
      </div>
    </EditorContext.Provider>
  );
};

export default connect(({ layers }: ConnectState) => {
  return { layers };
})(SymbolEditor);
