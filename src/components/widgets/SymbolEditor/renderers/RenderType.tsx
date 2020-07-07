import React, { FC, useContext } from 'react';
import _ from 'lodash';
import { EditOutlined, InfoCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { GeoRendererType, GeoRendererTypeTextMap } from '@/core/data-source/GeoRenderer';
import classes from 'classnames';
import { EditorContext } from '../index';

const GeoRenderCSSMap = {
  [GeoRendererType.Simple]: 'simple',
  [GeoRendererType.Water]: 'water',
  [GeoRendererType.UniqueValue]: 'unique-value',
  [GeoRendererType.ClassBreak]: 'class-break',
  [GeoRendererType.SceneWhite]: 'white-scene',
  [GeoRendererType.SceneMaterial]: 'material-scene',
  [GeoRendererType.Sketch]: 'sketch',
  [GeoRendererType.Billboard]: 'billboard',
};

export interface RenderTypePropTypes {
  type: GeoRendererType;
  canEdit?: boolean;
  onSelect: () => void;
  geometryType?: string;
}

const RenderType: FC<RenderTypePropTypes> = ({ canEdit, type, onSelect, geometryType }) => {
  const {
    renderer: [renderType, setRenderType],
    option: [editOption, setEditOption],
  } = useContext(EditorContext);

  return (
    <div
      className={classes('geomap-widget-symbol-editor__renders-item', {
        active: renderType === type,
      })}
      onClick={() => {
        if (renderType !== type) {
          setRenderType(type);

          if (_.isFunction(onSelect)) {
            onSelect();
          }
        }
      }}
    >
      <div
        className={classes(
          'geomap-widget-symbol-editor__renders-item-logo',
          GeoRenderCSSMap[type],
          {
            point: geometryType === 'point',
            polyline: geometryType === 'polyline',
            polygon: geometryType === 'polygon',
          },
        )}
      >
        {renderType === type ? <CheckCircleTwoTone /> : null}
      </div>
      <div className="geomap-widget-symbol-editor__renders-item-content">
        {(_.isBoolean(canEdit) && !canEdit) || renderType !== type ? (
          <span className="placeholder" />
        ) : (
          <span
            className="geomap-widget-symbol-editor__renders-item-conf"
            onClick={() => {
              setEditOption(true);
            }}
          >
            <EditOutlined />
            设置更多属性
          </span>
        )}

        <span className="geomap-widget-symbol-editor__renders-item-info">
          {GeoRendererTypeTextMap[type]}
          <InfoCircleOutlined />
        </span>
      </div>
    </div>
  );
};

export default RenderType;
