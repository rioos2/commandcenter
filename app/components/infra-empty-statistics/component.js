import Ember from 'ember';
const {get} = Ember;
export default Ember.Component.extend({
  intl: Ember.inject.service(),
  classNames: ["chart-os"],

  didInsertElement() {
    let d = document.getElementById('empty-message');
    d.insertAdjacentHTML('afterend', get(this, 'intl').t('dashboard.emptyNode'));
  },
});
