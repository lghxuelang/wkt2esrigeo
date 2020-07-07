import request from '../utils/request';

export default function getQuestionJson() {
  return request('./mock/questiondata.json', {
    method: 'GET',
    handleAs: 'json',
  });
}
