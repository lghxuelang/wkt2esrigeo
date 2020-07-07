import React, { FC } from 'react';
import _ from 'lodash';
import { SketchPicker } from 'react-color';
import { AwesomeColors } from '@/constants/colors';

export interface ColorValueEditorPropTypes {
  onChange: (color: string) => void;
  color: string;
}

const ColorValueEditor: FC<ColorValueEditorPropTypes> = ({ color, onChange }) => {
  function handleChange(color) {
    if (_.isFunction(onChange)) {
      onChange(color.hex);
    }
  }

  return (
    <SketchPicker color={color} onChangeComplete={handleChange} presetColors={AwesomeColors} />
  );
};

export default ColorValueEditor;
