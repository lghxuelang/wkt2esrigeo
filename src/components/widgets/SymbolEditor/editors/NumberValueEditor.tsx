import React, { FC, useState } from "react";
import { Input, Slider } from 'antd';

export interface NumberValueEditorPropTypes {
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const NumberValueEditor: FC<NumberValueEditorPropTypes> = ({ onChange, value, max }) => {
  const [v, setV] = useState<number>(value || 1);

  function handleSliderChange(value) {
    setV(value)
    if (onChange) {
      onChange(value);
    }
  }

  function handleInputChange(e) {
    const { value } = e.target;
    const reg = /^\d*?$/;
    if (!isNaN(+value) && reg.test(value)) {
      setV(+value);
      if (onChange) {
        onChange(+value);
      }
    }
  }

  return (
    <div className="geomap-widget-symbol-editor__outline">
      <Slider
        className="geomap-widget-symbol-editor__outline-slider"
        min={1}
        max={max}
        value={v}
        onChange={handleSliderChange}
      />
      <Input
        className="geomap-widget-symbol-editor__outline-input"
        value={v}
        maxLength={3}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default NumberValueEditor;
