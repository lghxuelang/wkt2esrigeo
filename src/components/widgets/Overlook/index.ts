/**
 * 环绕漫游（heading）比如：沿着建筑漫游
 * @author  lee  sceneviewer-02
 * @param {object} view  三维场景
 */
let roamHandle
function roamByHeading(view) {
  if (roamHandle) {
    clearInterval(roamHandle);
    roamHandle = null;
  } else {
    roamHandle = setInterval(() => {
      view.goTo({ heading: view.camera.heading + 0.5 });
    }, 100);
  }

}
/**
 * 环绕漫游 环绕漫游（longitude）比如：整个地图旋转
 * @author  lee  sceneviewer-03
 * @param {object} view  三维场景
 */
let roamByLongtitudeInterval;
function roamByLongtitude(view) {
  if (roamByLongtitudeInterval) {
    clearInterval(roamByLongtitudeInterval);
    roamByLongtitudeInterval = null;
  } else {
    roamByLongtitudeInterval = setInterval(() => {
      const camera = view.camera.clone();
      camera.position.longitude += 5;
      view.goTo(camera);
    }, 100);
  }
}

export  default  roamByHeading;
