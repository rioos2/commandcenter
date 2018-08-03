import C from 'nilavu/utils/constants';
import { isEmpty } from '@ember/utils';

export function nodeRetryInstallCondition(obj) {
  let add = true;

  if (isEmpty(obj)) {
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
