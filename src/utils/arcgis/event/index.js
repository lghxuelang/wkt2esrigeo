import clickHandle, { registerDefault as registerClick } from './click';
import hoverHandle from './hover';

export default {
  register(view) {
    view.on('click', clickHandle);
    view.on('hover', hoverHandle);
  },

  remove() {},

  addClickHandle(callback) {
    registerClick(callback);
  },
};
