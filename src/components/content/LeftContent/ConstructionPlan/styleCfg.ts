type Iconfig = {
  name: string,
  color: string,
  img: string,
}

export const COLOR_CONFIG:Iconfig[]  = [
{
  name: '基础',
  color: '#16CEB9',
  img: require('./images/基础.png')
},
{
  name: '住宅',
  color: '#999BFF',
  img:  require('./images/住宅.png')
},
{
  name: '民生',
  color: '#6648FF',
  img:  require('./images/民生.png')
},
{
  name: '产业',
  color: '#2D99FF',
  img: require('./images/产业.png')
},
{
  name: '未分',
  color: '#D38143',
  img:  require('./images/未知.png')
},
]

// 用于echarts
export const color2TypeTable={}
COLOR_CONFIG.forEach(({name,color}) => {
  color2TypeTable[name] = color
})

export const restColor = ['#43D3D3','#16CE45','#D343A0','#D34343']


// 地图3d点symbol样式
const verticalOffset = {
  screenLength: 40,
  maxWorldLength: 200,
  minWorldLength: 35,
};

function getUniqueValueSymbol(name: string, color: string) {
  return {
    type: 'point-3d', // autocasts as new PointSymbol3D()
    symbolLayers: [
      {
        type: 'icon', // autocasts as new IconSymbol3DLayer()
        resource: { href: name },
        size: 20,
        outline: {
          color: 'white',
          size: 2,
        },
      },
    ],
    verticalOffset: verticalOffset,
    callout: {
      type: 'line', // autocasts as new LineCallout3D()
      color: 'white',
      size: 2,
      border: { color },
    },
  };
}

export const pointsRenderer = {
  type: 'unique-value', // autocasts as new UniqueValueRenderer()
  field: 'xmlx',
  uniqueValueInfos: COLOR_CONFIG.reduce((result: any[], { name: value, color, img }) => {
    const symbol = getUniqueValueSymbol(img, color);
    result.push({ value, symbol });
    if (value === '基础') {
      result.push({ value: value + '设施', symbol });
    } else {
      result.push({ value: value + '项目', symbol });
    }
    return result;
  }, []),
};
