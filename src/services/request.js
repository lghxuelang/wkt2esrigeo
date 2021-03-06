import {fetch} from 'dva';
import NProgress from 'nprogress';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if ((response.status >= 200 && response.status < 300)|| response.ok === true) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // 浏览器头部进度条
  NProgress.start();
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      NProgress.done();
      return { data };
    })
    .catch((err) => {
      NProgress.done();
      return { err };
    });
}


