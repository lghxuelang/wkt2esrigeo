import React, { useEffect, useRef } from 'react';
import styles from './index.less';

interface SchedulePropTypes {}

const getPercentage = (current, max) => (100 * current) / max;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const Schedule: React.FC<SchedulePropTypes> = ({}) => {
  const sliderRef = React.useRef<any>();
  const thumbRef = React.useRef<any>();
  const diff = React.useRef<any>(0);

  const handleMouseMove = event => {
    event.stopPropagation();
    let newX = event.clientX - diff.current - sliderRef.current.getBoundingClientRect().left;
    const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
    const start = 0;

    if (newX < start) {
      newX = 0;
    }
    if (newX > end) {
      newX = end;
    }
    const newPercentage = getPercentage(newX, end);
    thumbRef.current.style.left = getLeft(newPercentage);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const handleMouseDown = event => {
    diff.current = event.clientX - thumbRef.current.getBoundingClientRect().left;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleContainerClick = event => {
    event.stopPropagation(event.clientX, diff.current, sliderRef.current);
    console.log(221, event.clientX , diff.current, sliderRef.current.getBoundingClientRect().left);
    let newX = event.clientX - diff.current - (sliderRef.current.getBoundingClientRect().left || 0);
    const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
    const newPercentage = getPercentage(newX, end);
    console.log(newPercentage, newX, end);
    thumbRef.current.style.left = getLeft(newPercentage);
  };
  return (
    <div className={styles.schedule}>
      <div ref={sliderRef} onClick={handleContainerClick} className={styles.timeline}>
        {['#FF3B3B', '#FF923B', '#D3FF3B', '#3BFFA4', '#00FFF9'].map(color => {
          return (
            <div className={styles.timelineBlock} style={{ background: color }}>
              <div className={styles.timelineInner}></div>
            </div>
          );
        })}
        <div
          draggable
          ref={thumbRef}
          className={styles.timelineDrag}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className={styles['table']}>
        <span>已完成</span>
        <div>
          <span>建设9B住宅项目</span>
          <span>2020年3月9日</span>
          <span>2020年3月9日</span>
        </div>
        <div>
          <span>生态谷跨惠风溪桥</span>
          <span>2020年3月9日</span>
          <span>2020年6月9日</span>
        </div>
      </div>

      <div className={styles['table']}>
        <span>进行中</span>
        <div>
          <span>建设9B住宅项目</span>
          <span>2020年3月9日</span>
          <span>2020年3月9日</span>
        </div>
        <div>
          <span>生态谷跨惠风溪桥</span>
          <span>2020年3月9日</span>
          <span>2020年6月9日</span>
        </div>
      </div>

      <div className={styles['table']}>
        <span>即将开始</span>
        <div>
          <span>建设9B住宅项目</span>
          <span>2020年3月9日</span>
          <span>2020年3月9日</span>
        </div>
        <div>
          <span>生态谷跨惠风溪桥</span>
          <span>2020年3月9日</span>
          <span>2020年6月9日</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
