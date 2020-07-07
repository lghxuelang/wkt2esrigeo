/**
 * The Zoom widget allows users to zoom in/out within a view.
 * @author
 * @module esri/widgets/AreaMeasurement2D
 * @since 4.0
 *
 */

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import classes from 'classnames';
import { connect } from 'umi';
import { ConnectState, ConnectProps } from '@/models/connect';
import { AppModelState } from '@/models/app';
import jsapi from '@/utils/arcgis/jsapi';
import ExpandViewModel = __esri.ExpandViewModel;
import ExpandViewModelConstructor = __esri.ExpandViewModelConstructor;

const CSS = {
  base: 'geomap-widget-expand',
  modeAuto: 'esri-expand--auto',
  modeDrawer: 'esri-expand--drawer',
  modeFloating: 'esri-expand--floating',
  container: 'esri-expand__container',
  containerExpanded: 'esri-expand__container--expanded',
  panel: 'esri-expand__panel',
  button: 'esri-widget--button',
  text: 'esri-icon-font-fallback-text',
  icon: 'esri-collapse__icon',
  iconExpanded: 'esri-expand__icon--expanded',
  iconNumber: 'esri-expand__icon-number',
  iconNumberExpanded: 'esri-expand__icon-number--expanded',
  expandIcon: 'esri-icon-expand',
  collapseIcon: 'esri-icon-collapse',
  content: 'esri-expand__content',
  contentExpanded: 'esri-expand__content--expanded',
  expandMask: 'esri-expand__mask',
  expandMaskExpanded: 'esri-expand__mask--expanded',
};

interface IExpand extends ConnectProps {
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  className?: string;
  autoCollapse?: boolean;
  title?: string;
  expanded?: boolean;
  group?: string;
  icon: JSX.Element | React.Component | ReactElement;
  app: AppModelState;
}

const Expand: React.FC<IExpand> = ({ title, app, children, style, className, expanded, group }) => {
  const [expState, setExpState] = useState<Boolean>(!!expanded);
  const vmRef = useRef<ExpandViewModel>();

  useEffect(() => {
    if (app.viewLoaded) {
      jsapi
        .load(['esri/widgets/Expand/ExpandViewModel'])
        .then(([ViewModel]: [ExpandViewModelConstructor]) => {
          vmRef.current = new ViewModel({
            view: window.agsGlobal.view,
          });
          if (group) {
            vmRef.current.group = group;
          }
          vmRef.current.watch('state', () => {
            setExpState((vmRef.current && vmRef.current.expanded) || false);
          });
        });
    }
  }, [app.viewLoaded, group]);

  function toggle() {}

  return (
    <div className={classes(CSS.base, className)} style={style}>
      <div
        onClick={toggle}
        className={classes(CSS.expandMask, {
          [CSS.expandMaskExpanded]: expState,
        })}
      />
      <div
        className={classes(CSS.container, {
          [CSS.containerExpanded]: expState,
        })}
      >
        <div className={CSS.panel}>
          <div onClick={toggle} className={CSS.button}>
            <span
              className={classes(CSS.icon, {
                [CSS.iconExpanded]: expState,
                [CSS.collapseIcon]: expState,
                [CSS.expandIcon]: !expState,
              })}
            />
            <span className={CSS.text}>{title}</span>
          </div>
        </div>
        <div
          className={classes(CSS.content, {
            [CSS.contentExpanded]: expState,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default connect(({ app }: ConnectState) => {
  return { app };
})(Expand);
