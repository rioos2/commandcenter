import { helper } from '@ember/component/helper';

export function secretKey(data) {
  return JSON.stringify(data).split('_').get('lastObject').replace(/[^\w\s]/gi, '');
}

export default helper(secretKey);
