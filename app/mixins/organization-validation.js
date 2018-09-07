import InputValidation from 'nilavu/models/input-validation';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Mixin.create({

  intl: service(),

  // If blank, fail with a reason
  organizationNameValidation: computed('originName', function() {
    if (
      isEmpty(this.get('originName'))
    ) {
      return InputValidation.create({
        failed: true,
        reason: get(this, 'intl').t('nav.organization.create.orgNameEmpty')
      });
    }

    return InputValidation.create({ ok: true });
  }),
});
