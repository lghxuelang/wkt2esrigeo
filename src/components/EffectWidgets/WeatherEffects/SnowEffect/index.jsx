import React, { useEffect, useRef } from 'react';
import styles from './index.less';


const SnowEffects = (props) => {
  const canvas1Div = useRef('');
  useEffect(() => {
    const canvas1 = canvas1Div.current;
    var ctx = canvas1.getContext('2d');
    var wid = window.innerWidth;
    var hei = window.innerHeight;
    canvas1.width = wid;
    canvas1.height = hei;
    var snow = 500; //雪花数量
    var arr = []; //保存雪花坐标，半径
    for (var i = 0; i < snow; i++) {
      arr.push({
        x: Math.random() * wid,
        y: Math.random() * hei,
        r: Math.random() * 7,
      });
    }

    function DrawSnow() {
      ctx.clearRect(0, 0, wid, hei);
      ctx.beginPath();
      for (var i = 0; i < snow; i++) {
        var p = arr[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
      }
      ctx.fill();
      ctx.stroke();
      SnowFall();
      ctx.closePath();
    }

//雪花飘落
    function SnowFall() {
      for (var i = 0; i < snow; i++) {
        var p = arr[i];
        p.y += Math.random() * 50 + 1;
        if (p.y > hei) {
          p.y = 0;
        }
        p.x += Math.random() * 50 + 1;
        if (p.x > wid) {
          p.x = 0;
        }
      }
    }

    setInterval(DrawSnow, 100);


  }, []);

  return (
    <div className={styles.rainWrapper}>
      <canvas ref={canvas1Div} className={styles.canvas1}></canvas>
    </div>
  );
};
export default SnowEffects;
