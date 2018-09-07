import InputValidation from 'nilavu/models/input-validation';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Mixin.create({

  intl: service(),

  // If blank, fail with a reason
  userNameValidation: computed('username', function() {
    if (
      isEmpty(this.get('username'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('loginPage.require.email')
      });
    }

    return InputValidation.create({ ok: true });
  }),

  // If blank, fail with a reason
  passwordValidation: computed('password', function() {
    if (
      isEmpty(this.get('password'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('loginPage.require.password')
      });
    }

    return InputValidation.create({ ok: true });
  }),

});
