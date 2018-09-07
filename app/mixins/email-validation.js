import InputValidation from 'nilavu/models/input-validation';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import validator from 'npm:validator';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Mixin.create({

  intl:            service(),
  emailValidation: computed('accountEmail', function() {

    if (isEmpty(this.get('accountEmail'))) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validation.user.name.empty_email_id')
      });
    }
    if (!validator.isEmail(this.get('accountEmail'))) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validation.user.name.valid_email_id')
      });
    }


    return InputValidation.create({ ok: true });
  }),
});
