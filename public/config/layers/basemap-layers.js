(function (window) {
    var basemapConfig = [
        {
            title: '天地图矢量',
            iconUrl: './images/basemap/tdtsl.png',
            id: 'basemap-01',
            active: true,
            baseLayers: [
                {
                    title: '天地图矢量图层',
                    type: 'WebTileLayer',
                    url: 'https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=44964a97c8c44e4d04efdf3cba594467'
                }, {
                    title: '天地图注记图层',
                    type: 'WebTileLayer',
                    url: 'https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=44964a97c8c44e4d04efdf3cba594467'
                },
            ],
        },
        {
            title: '天地图影像',
            iconUrl: './images/basemap/tdtyy.png',
            id: 'basemap-02',
            avtive: false,
            baseLayers: [
                {
                    title: '天地图影像图层',
                    type: 'WebTileLayer',
                    url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&tk=44964a97c8c44e4d04efdf3cba594467'
                }, {
                    title: '天地图影像图层',
                    type: 'WebTileLayer',
                    url: 'https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={col}&y={row}&l={level}&tk=44964a97c8c44e4d04efdf3cba594467'
                },
            ],
        },
        {
            title: '午夜蓝',
            iconUrl: './images/basemap/bmap.png',
            id: 'basemap-03',
            baseLayers: [
                {
                    title: '天地图影像',
                    type: 'TileLayer',
                    url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                },
            ],
        },
        {
            title: '天津生态城',
            iconUrl: './images/basemap/bmap.png',
            id: 'basemap-04',
            baseLayers: [
                {
                    title: '天津生态城切片',
                    type: 'VectorTileLayer',
                    url: 'https://103.233.7.3:8119/arcgis/rest/services/Hosted/天津生态城底图配色_捷泰_含周边/VectorTileServer',
                },
            ],
        },
    ];;
    window.basemapConfig = basemapConfig;
})(window);

