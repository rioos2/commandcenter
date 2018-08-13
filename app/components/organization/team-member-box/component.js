import Component from '@ember/component';

export default Component.extend({
  classNames:       ['container-list'],

  memberStatus: function() {
    return 'success';
  }.property('member.status'),


});
