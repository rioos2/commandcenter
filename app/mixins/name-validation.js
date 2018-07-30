import InputValidation from "nilavu/models/input-validation";
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import {
  get
} from '@ember/object';

export default Mixin.create({

  intl: Ember.inject.service(),

  fullNameValidation: computed('firstName', function() {
    if (
      Ember.isEmpty(this.get("firstName"))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_first_name')
      });
    }

    return InputValidation.create({
      ok: true
    });
  }),

  lastNameValidation: computed('lastName', function() {
    if (
      Ember.isEmpty(this.get("lastName"))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('validate.user.name.empty_last_name')
      });
    }

    return InputValidation.create({
      ok: true
    });
  }),

});
