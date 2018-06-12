import Controller from '@ember/controller';
import D from 'nilavu/utils/default';
const {
  get
} = Ember;
export default Controller.extend({
  intl: Ember.inject.service(),

  summaryContent: null,

});
