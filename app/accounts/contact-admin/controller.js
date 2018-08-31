import { get } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  intl: service(),

  tagName:   'section',
  className: '',

  msg: function() {
    return htmlSafe(get(this, 'intl').t('guardian.regular.organization.noOrigin'));
  }.property(''),

});
