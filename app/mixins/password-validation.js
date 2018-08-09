import InputValidation from 'nilavu/models/input-validation';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import EmberMap from '@ember/map';
import { isEmpty } from '@ember/utils';
/*   USAGE
 *  set passwordMinLength, passwordRequired propertie on controller or component when use this mixin.
 */

export default Mixin.create({
  intl:              service(),
  rejectedPasswords: null,

  init() {
    this._super();
    this.set('rejectedPasswords', []);
    this.set('rejectedPasswordsMessages', EmberMap.create());
  },

  passwordMinLength: computed('passwordMinLength', function() {
    // Default password length 8 if passwordMinLength not set explicitly on controller or component
    return this.get('passwordMinLength') || 8;
  }),

  passwordValidation: computed('password',
    'username', 'passwordRequired', 'rejectedPasswords.[]', 'accountEmail', 'passwordMinLength',
    function() {
      // Check whether the password need or not
      if (!this.get('passwordRequired')) {
        return InputValidation.create({ ok: true });
      }

      // If blank, fail with a reason
      if (isEmpty(this.get('password'))) {
        return InputValidation.create({
          failed: true,
          reason: get(this, 'intl').t('validate.user.password.empty_password')
        });
      }

      if (this.get('rejectedPasswords').includes(this.get('password'))) {
        return InputValidation.create({
          failed: true,
          reason: this.get('rejectedPasswordsMessages').get(this.get('password')) ||
            get(this, 'intl').t('validate.user.password.common_password')
        });
      }

      // If too short
      if (this.get('password').length < this.get('passwordMinLength')) {
        return InputValidation.create({
          failed: true,
          reason: get(this, 'intl').t('validate.user.password.too_short', { character_length: this.get('passwordMinLength') })
        });
      }

      if (!isEmpty(this.get('username')) && this.get('password') === this.get('username')) {
        return InputValidation.create({
          failed: true,
          reason: get(this, 'intl').t('validate.user.password.same_as_username')
        });
      }

      if (!isEmpty(this.get('accountEmail')) && this.get('password') === this.get('accountEmail')) {
        return InputValidation.create({
          failed: true,
          reason: get(this, 'intl').t('validate.user.password.same_as_email')
        });
      }

      // Looks good!
      return InputValidation.create({
        ok:     true,
        reason: 'okay'
      });
    })
});
