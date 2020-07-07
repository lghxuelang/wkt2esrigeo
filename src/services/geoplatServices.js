import request from './request';


// 设置基本的opthions
function setOptions(method='GET', param) {
  // const token = JSON.parse(sessionStorage.getItem('userInfo'));
  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsZW9wYXJkIiwianRpIjoiMSIsInN1YiI6ImVzcmkiLCJpYXQiOjE1NzQ5MDUxODYsImV4cCI6MTU3NDk0ODM4Nn0.GXhKJ2AHbr0ps8DnH0qn5lobO29ecm7dcBh-Ae_cKJ4Sw9mVDC1AIHNOzAuSUHLN3sfU4PMbq-Kzij4C-LGLAA';
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? token : ''
    },
    handleAs: 'json',
  };
  if (param) {
    options.body = JSON.stringify(param);
  }
  return options;

}

// 获取所有的模型信息
export function getBimType() {
  const options =  setOptions('GET');
  return request(window.appcfg.servicesUrl + '/property/getBimType', options);
}