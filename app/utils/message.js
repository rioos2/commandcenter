import C from 'nilavu/utils/constants';
import { isEmpty } from '@ember/utils';
// Sender should send a valid
// The first parameter is a valid ANALYTIC_EVENT like LOGGED_IN.
// The send parameter can be have various segmentation kvs. Th segmentation key
// is prefixed with seg_
function messageNow(str, opts = {}) {
  let id = C.ANALYTIC_EVENTS_ALL.find((event) => {
    return (event === str);
  });

  let segkv = opts;

  /* Just filter the stuff with keys that starts with seg_
    opts.filter((f) => f.key.startsWith("seg_")) || {};
    */

  if (!isEmpty(id)) {
    return {
      'key':          id,
      'count':        1,
      'segmentation': segkv,
    };
  }
}

export { messageNow };
