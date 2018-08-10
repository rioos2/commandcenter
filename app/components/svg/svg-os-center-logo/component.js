import Component from '@ember/component';

export default Component.extend({

  seletedOs: function() {
    if (this.get('selected')) {
      return this.get('selected');
    } else {
      return 'none.png';
    }
  }.property('selected'),

});
