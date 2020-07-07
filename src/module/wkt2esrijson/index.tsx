/**
 * wkt对象转化为esri api可用的json对象
 */
export default function wkt2esrijson(wkt: Array<string> | string) {
  if (!Array.isArray(wkt) && 'string' !== typeof wkt) {
    console.error('参数格式错误,请传入正确的wkt字符串或wkt字符串数组');
    return wkt;
  }
  switch (typeof wkt) {
    case 'string': {
      const index = wkt.indexOf(' ');
      const type = wkt.substr(0, index).toLocaleLowerCase();
      switch (type) {
        case 'point': {
          const arr = wkt.substr(index + 1).split(' ');
          const x = Number(arr[0].replace('(', ''));
          const y = Number(arr[1].replace(')', ''));
          return {
            x,
            y,
          };
        }
        case 'multipoint': {
          return '';
        }

        case 'linestring': {
          const str = wkt.substr(index + 1);
          const nArr = str.replace('(', '').replace(')', '');
          const arr = nArr.split(', ');
          const paths: Array<Array<number>> = [];
          arr.map(pStr => {
            let p = pStr.split(' ');
            let x = Number(p[0]);
            let y = Number(p[1]);
            paths.push([x, y]);
          });
          return { paths: [paths] };
        }
      }
    }
    case 'object': {
    }
    default: {
      return null;
    }
  }
}
