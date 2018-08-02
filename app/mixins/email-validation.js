import InputValidation from "nilavu/models/input-validation";
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import validator from 'npm:validator';
import {
  get
} from '@ember/object';

export default Mixin.create({

  intl: Ember.inject.service(),

  emailValidation: computed('accountEmail', function() {

        if (Ember.isEmpty(this.get("accountEmail"))) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_email_id')
      });
    }
        if(!validator.isEmail(this.get("accountEmail"))) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.valid_email_id')
      });
    }


    return InputValidation.create({
      ok: true
    });
  }),
});
