(function (window) {

  // 基本通用配置
  var commonConfig = {
    /**
      * 代理配置项
      * 说明：所有的代理均需要在此配置，例如登录
     * */
    proxy: 'http://geomap.arcgisonline.cn/Java/proxy.jsp',
    // 后台服务地址
    servicesUrl: 'https://bim.arcgisonline.cn/geoplatservice',


    /* -------------如果需要从jsapi中创建基础地图和添加图层可从本配置文件配置 -----------------*/
    jsapiConfig: {
      /**
       * 此项目配置地图的初始化范围
       * */
      initialExtent: {
        "xmin": 10676989.007171417,
        "ymin": 3691768.952489664,
        "xmax": 15373280.025011396,
        "ymax": 5915169.231248279,
        "spatialReference": { wkid: 102100, latestWkid: 3857 },
      },
      initialCamera: {
        fov: 55,
        heading: 12.883013976245085,
        tilt: 0.4980215412741243,
        position: {
          x: 117.7608577936728,
          y: 39.1377761137939,
          z: 27692.108662435785,
          spatialReference: { wkid: 4326 },
        },
      },
    },

    /* -----------如果需要从portal中创建基础底图和添加图层可从本配置文件配置-------------- */

    portalConfig: {
      hostServer: 'http://pku-geo.arcgisonline.cn/server/',
      portal: 'http://pgis.arcgisonline.cn/arcgis/', //格式 'http://pgis.arcgisonline.cn/arcgis/',

      /**
       * 此项目配置地图基础底图，需要从portal进行设置
       * webSceneId：三维地图基础底图
       * */
      webSceneId: '92392e2316844429b33f1063b7b88843',
      /**
       * 此项目配置地图基础底图，需要从portal进行设置
       * webMapId：二维地图基础底图
       * */
      webMapId: '92392e2316844429b33f1063b7b88843',
      /**
       * 代理配置项
       * 说明：所有的代理均需要在此配置，例如登录
       * */
      proxy: 'http://geomap.arcgisonline.cn/Java/proxy.jsp',

      appId: '',
      useOauth: false,
    },

  };

  window.appcfg = commonConfig;
})(window);

