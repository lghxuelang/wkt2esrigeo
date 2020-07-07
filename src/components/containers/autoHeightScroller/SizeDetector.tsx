import React, { useRef, useEffect } from 'react';
import _ from 'lodash';

interface SizeDetectPropTypes {
  children?: JSX.Element | React.Component;
  onResize: Function;
}

const SizeDetector: React.FC<SizeDetectPropTypes> = ({ children, onResize }) => {
  const domRef: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    function notifyChange(w: number, h: number) {
      if (_.isFunction(onResize)) {
        onResize(w, h);
      }
    }

    if (domRef.current) {
      notifyChange(domRef.current.clientWidth, domRef.current.clientHeight);
    }

    // 如果有改变大小的需求，可以继续添加resize event listener
  }, [onResize]);

  return (
    <div ref={domRef} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default SizeDetector;
