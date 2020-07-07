import React, { Component, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import echarts from 'echarts';

type Dict = {
  [key: string]: any;
};

interface Iopts {
    devicePixelRatio: number | undefined,
    renderer: 'canvas' | 'svg',
    width: number  | undefined | 'auto',
    height:  number  | undefined | 'auto',
}

interface IProps {
  option: Dict;
  theme?: string | Dict;
  style?: Dict;
  className?: string;
  onEvents?: Dict;
  shouldSetOption?: (prevProps:any, props:any) => boolean;
  onChartReady?: (echartObj:any)=>void;
  loadingOption?: Dict;
  showLoading?: boolean;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  opts?: Iopts | void ;
}

const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const EchartsWrap: React.FC<IProps>  = (props)=> {
  const {
    option,
    notMerge,
    lazyUpdate,
    showLoading,
    loadingOption,
    style = {},
    className = '',
  } = props;
  const prevProps = usePrevious(props);

  const echartsElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rerender();
    return () => {
      dispose();
    };
  }, []);

  // 检测配置更新
  useEffect(() => {
   if (!echartsElement.current) return 
    // 以下属性修改的时候，需要 dispose 之后再新建
    // 1. 切换 theme 
    // 2. 修改 opts 
    // 3. 修改 onEvents ，取消所有之前绑定的事件
    console.log()
    if (
      !isEqual(prevProps?.theme, props.theme) ||
      !isEqual(prevProps?.opts, props.opts) ||
      !isEqual(prevProps?.onEvents, props.onEvents)
    ) {
      dispose();
      rerender(); // 重建
      return;
    }

    // 当这些属性保持不变的时候，不setOption
    const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
    if (isEqual(pick(props, pickKeys), pick(prevProps, pickKeys))) {
      return;
    }

    // 对外提供判断是否需要setOption的接口,默认为 true
    if (typeof props.shouldSetOption === 'function' && !props.shouldSetOption(prevProps, props)) {
      return;
    }

    const echartObj = renderEchartDom();
    // 样式修改的时候，可能会导致大小变化，触发一下 resize
    if (!isEqual(prevProps?.style, props.style) || !isEqual(prevProps?.className, props.className)) {
      // try {
      //   echartObj.resize();
      // } catch (e) {
      //   console.warn(e);
      // }
    }
  }, [props]);

  const getEchartsInstance = async () => {
    if (!echartsElement.current) {
      console.error('对象没有初始化');
      // await waitTime()
      return;
    }
    const opts ={
      devicePixelRatio: void 0,
      renderer: 'canvas' ,
      width:  'auto',
      height:  'auto',
  }
    return (
      echarts.getInstanceByDom(echartsElement.current) ||
      echarts.init(echartsElement.current, props.theme, props.opts || opts)
    );
  };

  const dispose = () => {
    if (echartsElement.current) {
      // dispose echarts instance
      echarts.dispose(echartsElement.current);
    }
  };

  // 重新渲染
  const rerender = async () => {
    const { onEvents, onChartReady } = props;

    const echartObj = await renderEchartDom();
    console.log(echartObj)
    bindEvents(echartObj, onEvents || {});

    // on chart ready
    if (typeof onChartReady === 'function') onChartReady(echartObj);
  };

  // 绑定事件
  const bindEvents = (instance, events) => {
    const _bindEvent = (eventName, func) => {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof func === 'function') {
        // binding event
        // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作
        instance.on(eventName, param => {
          func(param, instance);
        });
      }
    };

    // loop and bind
    for (const eventName in events) {
      if (Object.prototype.hasOwnProperty.call(events, eventName)) {
        _bindEvent(eventName, events[eventName]);
      }
    }
  };

  // 渲染dom
  const renderEchartDom = async () => {
    // init the echart object
    const echartObj: any = await getEchartsInstance();



    //设置echart option
    echartObj.setOption(props.option, props.notMerge || false, props.lazyUpdate || false);
    // 加载遮罩
    if (props.showLoading) echartObj.showLoading(props.loadingOption || null);
    else echartObj.hideLoading();

    return echartObj;
  };

  const newStyle = {
    height: 300,
    ...style,
  };
  return <div ref={echartsElement} style={newStyle} className={`echarts-wrap ${className}`}></div>;
};


EchartsWrap.defaultProps = {
  notMerge: false,
  lazyUpdate: false,
  style: {},
  className: '',
  onChartReady: () => {},
  showLoading: false,
  onEvents: {},
  shouldSetOption: () => true,

};

export default EchartsWrap;
