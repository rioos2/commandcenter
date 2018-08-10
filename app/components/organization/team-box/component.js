import Component from '@ember/component';

export default Component.extend({
  classNames:       ['container-list'],

  teamStatus: function() {
    return 'success';
  }.property('model.status'),


});
