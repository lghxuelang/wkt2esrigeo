/**
 * The Daylight widget allows users to Daylight widget within a view.
 * @author wangxd
 * @date 2020-03-06
 */

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Slider, DatePicker, Row, Col, Checkbox, message } from 'antd';
// import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
// 引入arcgis 工具类库
import { viewUtils } from '@/utils/arcgis/index';
// 引入model
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';
// 引入公共样式组件
import StyledPanel from '@/components/containers/styledPanel';
// 引入样式和图片
import './index.less';
import caretRight from './images/play.png';
import pause from './images/stop.png';

const MARKS = {
  0: '上午0点',
  360: '上午6点',
  720: '中午12点',
  1080: '下午6点',
  1440: '下午12点',
};

/**
 * 根据当前时刻修改光照
 * @param {moment} curMoment
 */
const _changeEnvLight = async (curMoment: any) => {
  // todo 加截流
  // todo 加日期移动时拖动时间slider功能
  const cloneMoment = curMoment.clone();
  const view = await viewUtils.isViewReady();
  // 修改成时间戳
  view.environment.lighting.date = +cloneMoment.format('x');
};

// 日照分析组件

interface MapToolbarPropTypes extends ConnectProps {
  maptoolbar: MaptoolbarModelState;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClose: Function;
}
const LightshadowPanel: React.FC<MapToolbarPropTypes> = props => {
  const [isShowShadow, setIsShowShadow] = useState<any>(false);
  const [isSliderStop, setIsSliderStop] = useState<Boolean>(true);
  const [isDatePickerStop, setIsDatePickerStop] = useState<Boolean>(true);
  const [momentForLight, setMomentForLight] = useState(moment());
  const [sliderValue, setSliderValue] = useState<number>(0);
  const timerOfSlider = useRef<any>(null);
  const timerOfDatepicker = useRef<any>(null);
  const { maptoolbar, style, onClose } = props;
  // 重置timer
  const _resetTimers = () => {
    if (timerOfSlider.current) {
      clearInterval(timerOfSlider.current);
      timerOfSlider.current = null;
    }
    if (timerOfDatepicker.current) {
      clearInterval(timerOfDatepicker.current);
      timerOfDatepicker.current = null;
    }
  };

  // 解除挂载清除timer
  useEffect(() => {
    return _resetTimers;
  }, []);

  useEffect(() => {
    console.log(maptoolbar.activeToolbar)
    setIsShowShadow(false);
    setIsDatePickerStop(true);
    setIsSliderStop(true);
    setMomentForLight(moment(new Date(), 'YYYY/MM/DD'));
    setSliderValue(moment().hour() * 60 + moment().minute());
    _resetTimers();
  }, [maptoolbar.activeToolbar]);

  // 当日照分析到达24点时自动停止
  useEffect(() => {
    if (!isSliderStop && timerOfSlider.current && sliderValue > 1440) {
      clearInterval(timerOfSlider.current);
      setIsSliderStop(true);
    }
    // eslint-disable-next-line
  }, [sliderValue]);

  /**
   * 日期控件选择change事件
   */
  const handleDatePickerChange = (value: any) => {
    setMomentForLight(value);
    _changeEnvLight(value);
  };

  /**
   * 时间播放按钮回调
   */
  function handleSliderPlayClick() {
    if (!isDatePickerStop) {
      message.info('暂时不支持同时模拟');
      return;
    }
    if (sliderValue >= 1440) return;
    if (!isSliderStop) {
      // 播放中进行暂停操作
      clearInterval(timerOfSlider.current);
      setIsSliderStop(true);
      return;
    }
    //播放
    let curNum = sliderValue; // 闭包
    setIsSliderStop(false);
    timerOfSlider.current = setInterval(() => {
      let tempMoment = momentForLight
        .clone()
        .hour(curNum / 60)
        .minute(curNum % 60);
      _changeEnvLight(tempMoment);
      setSliderValue(() => (curNum += 10));
    }, 50);
  }

  // 日期播放按钮回调
  const handleDatepickerPlayClick = () => {
    if (!isSliderStop) {
      message.info('暂时不支持同时模拟');
      return;
    }
    if (!isDatePickerStop) {
      clearInterval(timerOfDatepicker.current);
      setIsDatePickerStop(true);
      return;
    }
    let curMoment = momentForLight.clone();
    setIsDatePickerStop(false);
    timerOfDatepicker.current = setInterval(() => {
      let tempMoment = curMoment.add(1, 'days');
      _changeEnvLight(tempMoment);
      setMomentForLight(tempMoment.clone());
    }, 100);
  };

  /**
   * 时间轴点击回调
   */
  const onSliderChange = (value: any) => {
    // 将传入的value转换为小时，分钟
    const tempTime2 = momentForLight.hour(value / 60).minute(value % 60);
    setMomentForLight(tempTime2);
    setSliderValue(value);
    _changeEnvLight(tempTime2);
  };

  /**
   * 显示阴影checkbox check事件回调
   */
  const onCheckBoxChange = async (e: any) => {
    setIsShowShadow(e.target.checked);
    const view = await viewUtils.isViewReady();
    view.environment.lighting.directShadowsEnabled = e.target.checked;
  };

  return (
    <div className="geomap-widget-daylight" style={style}>
      <StyledPanel>
        <div className="geomap-widget-daylight__daylight-content">
          <p className="geomap-widget-daylight__daylight-title">
            日光
            <span className="geomap-widget-daylight__daylight-closebtn" onClick={(): void => onClose && onClose()}>
              ×
            </span>
          </p>
          <div className="geomap-widget-daylight__daylightcontent-cols">
            <Row
              style={{
                marginBottom: '52px',
              }}
            >
              <Col span={24}>
                <Slider
                  marks={MARKS}
                  max={1440}
                  defaultValue={sliderValue}
                  tipFormatter={null}
                  value={sliderValue}
                  onChange={onSliderChange}
                />
              </Col>
            </Row>
            <Row
              style={{
                marginBottom: '32px',
              }}
            >
              <Col span={20} offset={1}>
                <span
                  className="geomap-widget-daylight__daylightcontent-startbtn"
                  onClick={handleSliderPlayClick}
                >
                  开始
                </span>
              </Col>
            </Row>
            <Row
              style={{
                marginBottom: '32px',
              }}
            >
              <Col span={20}>
                <DatePicker
                  showToday={false}
                  allowClear={false}
                  defaultValue={momentForLight}
                  value={momentForLight}
                  format="YYYY-MM-DD"
                  onChange={handleDatePickerChange}
                  className="geomap-widget-daylight__daylightcontent-datepicker"
                />
              </Col>
              <Col
                span={2}
                offset={1}
                className="geomap-widget-daylight__daylightcontent-datastartbtn"
              >
                <span onClick={handleDatepickerPlayClick}>
                  <img src={isDatePickerStop ? caretRight : pause} alt="" />
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Checkbox checked={isShowShadow} onChange={onCheckBoxChange}>
                  显示阴影
                </Checkbox>
              </Col>
            </Row>
          </div>
        </div>
      </StyledPanel>
    </div>
  );
};

export default connect(({ maptoolbar }: ConnectState) => {
  return {
    maptoolbar,
  };
})(LightshadowPanel);
