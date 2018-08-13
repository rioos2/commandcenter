import Component from '@ember/component';

export default Component.extend({

  enable: function() {
    return this.get('hide') ? 'disabled' : '';
  }.property('hide'),

  actions:  {
    doAction() {
      this.sendAction('btnAction');
    }
  }
});
