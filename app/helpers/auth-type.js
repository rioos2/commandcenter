import Ember from 'ember';
import C from 'nilavu/utils/constants';

export function authType(type /*, hash*/) {
  return C.AUTH_TYPES[type];
}

export default Ember.Helper.helper(authType);
