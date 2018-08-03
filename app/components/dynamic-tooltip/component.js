import Ember from 'ember';

export default Ember.Component.extend({

  tagName: '',

  showMsg: function() {
    return !Ember.isEmpty(this.get('msg')) ? false : true;
  }.property('msg'),

});
