import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),


  enabler: function() {
    return Ember.isEmpty(this.get('point')) ? "" : 'disabled';
  }.property('point'),

  errorMsg: function() {
    return !this.get('enabler') ? "" : get(this, 'intl').t('stackPage.admin.storage.pool.diskChooseMsg');
  }.property('enabler'),

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updatePoolData', this.get('active'),this.get('name'));
    },
  }
});
