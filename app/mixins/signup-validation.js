import InputValidation from 'nilavu/models/input-validation';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Mixin.create({

  intl:                  service(),
  companyNameValidation: computed('company_name', function() {
    if (
      isEmpty(this.get('company_name'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_company_name')
      });
    }

    return InputValidation.create({ ok: true });
  }),

  fullNameValidation: computed('first_name', function() {
    if (
      isEmpty(this.get('first_name'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_first_name')
      });
    }

    return InputValidation.create({ ok: true });
  }),

  lastNameValidation: computed('last_name', function() {
    if (
      isEmpty(this.get('last_name'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_last_name')
      });
    }

    return InputValidation.create({ ok: true });
  }),

  phoneValidation: computed('phone', function() {
    if (
      isEmpty(this.get('phone'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_phone_number')
      });
    }

    return InputValidation.create({ ok: true });
  }),
});
