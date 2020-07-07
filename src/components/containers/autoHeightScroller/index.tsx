import React, { useState } from 'react';

import SizeDetector from './SizeDetector';
import ScrollContent from './ScrollContent';

interface AutoHScrollPropTypes {
  children?: JSX.Element | React.Component;
}

const AutoHeightScroller: React.FC<AutoHScrollPropTypes> = ({ children }) => {
  const [maxHeight, setMaxH] = useState(0);

  return (
    <SizeDetector
      onResize={(w: number, h: number) => {
        setMaxH(h);
      }}
    >
      <ScrollContent max={maxHeight}>{children}</ScrollContent>
    </SizeDetector>
  );
};

export default AutoHeightScroller;
