import Ember from 'ember';
import Util from 'nilavu/utils/util';
import C from 'nilavu/utils/constants';

export function nodeRetryInstallCondition(obj) {
  let add = true;

  if (Ember.isEmpty(obj)) {
    add = false;
  } else {
    obj.forEach((condition) => {
      if (C.NODE.NINJA_NODES_RETRY_INSTALL_CONDITIONS.includes(condition.condition_type)) {
        add = false;
      }
    });
  }

  return add;
}
