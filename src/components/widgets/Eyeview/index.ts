/**
 * 人视角工具类
 * @author Joker-lee
 * @date 2020-04-22
 */

interface IEyeview {
}

export default class Eyeview implements IEyeview {

  constructor({}) {
  }

  active() {
    const view = window.agsGlobal?.view;
    const cam = view.camera.clone();
    cam.tilt = 88;
    cam.fov = 55;
    cam.heading = 45;
    const self = this;
    const mouseClickHandle = view.on('click', (evt) => {
      const point = view.toMap({
        x: evt.x,
        y: evt.y,
        // z: 50000,
      });
      cam.position = point;
      view.camera = cam;
      view.goTo(cam);
      mouseClickHandle.remove();
    });
    const keyDownhandle = view.on('key-down', (evt) => {
      // if (evt.key === 'a') {
      //   const cam = view.camera.clone();
      //   cam.heading -= 0.5;
      //   view.camera = cam;
      // }
      // if (evt.key === 'd') {
      //   const cam = view.camera.clone();
      //   cam.heading += 0.5;
      //   view.camera = cam;
      // }
      // if (evt.key === 'w') {
      //   const cam = view.camera.clone();
      //   const radian = (parseInt(cam.heading, 10) * Math.PI) / 180;
      //   cam.position.x += 1 * Math.sin(radian);
      //   cam.position.y += 1 * Math.cos(radian);
      //   view.camera = cam;
      // }
      // if (evt.key === 's') {
      //   const cam = view.camera.clone();
      //   const radian = (parseInt(cam.heading, 10) * Math.PI) / 180;
      //   cam.position.x -= 1 * Math.sin(radian);
      //   cam.position.y -= 1 * Math.cos(radian);
      //   view.camera = cam;
      // }

    });
  }


}
