import React from 'react';
import CustomScroller from 'react-custom-scrollbars';

interface ScrollContentPropTypes {
  children?: JSX.Element | React.Component;
  max: number;
}

interface ThumbPropTypes {
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

const renderThumb: React.FC<ThumbPropTypes> = ({ style, ...props }) => {
  //设置滚动条的样式
  const thumbStyle = {
    width: '6px',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: '6px',
    right: '4px',
  };

  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const ScrollContent: React.FC<ScrollContentPropTypes> = ({ children, max }) => {
  return (
    <CustomScroller autoHeight autoHeightMax={max} renderThumbVertical={renderThumb}>
      {children}
    </CustomScroller>
  );
};

export default ScrollContent;
