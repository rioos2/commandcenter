import InputValidation from 'nilavu/models/input-validation';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({

  intl: Ember.inject.service(),

  // If blank, fail with a reason
  userNameValidation: computed('username', function() {
    if (
      Ember.isEmpty(this.get('username'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_name')
      });
    }

    return InputValidation.create({ ok: true });
  }),

  // If blank, fail with a reason
  passwordValidation: computed('password', function() {
    if (
      Ember.isEmpty(this.get('password'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.password.empty_password')
      });
    }

    return InputValidation.create({ ok: true });
  }),

});
