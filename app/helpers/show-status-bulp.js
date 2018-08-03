import Ember from 'ember';
import C from 'nilavu/utils/constants';

export function showStatusBulb(params) {
  var state;
  C.NODE.STATUS.READY.forEach(status => {
    if (status === (params[0]||'').toLowerCase()) {
      state = "sd-green";
    }
  });
  C.NODE.STATUS.INITIAL.forEach(status => {
    if (status === (params[0]||'').toLowerCase()) {
      state = "sd-yellow";
    }
  });
  C.NODE.STATUS.NOTREADY.forEach(status => {
    if (status === (params[0]||'').toLowerCase()) {
      state = "sd-red";
    }
  });
return state;
}

export default Ember.Helper.helper(showStatusBulb);
