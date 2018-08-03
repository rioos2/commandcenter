import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  selectionChecker: function() {
    var check = (this.get('model.stacksfactory.os') == this.get('versionDetail.type') && this.get('model.stacksfactory.resources.version') == this.get('versionDetail.version'));

    if (!check) {
      this.set('active', '');
    }
  }.observes('activate'),

  active: function() {
    var check = (this.get('model.stacksfactory.os') == this.get('versionDetail.type') && this.get('model.stacksfactory.resources.version') == this.get('versionDetail.version'));

    if (check) {
      this.set('model.stacksfactory.plan', this.get('versionDetail.id'));
      this.set('model.distro_description', this.get('versionDetail.description'));
    }

    return (this.get('model.stacksfactory.os') == this.get('versionDetail.type') && this.get('model.stacksfactory.resources.version') == this.get('versionDetail.version')) ? 'selected' : '';
  }.property('model.stacksfactory.os', 'model.stacksfactory.resources.version'),

  actions: {
    chooseVM() {
      this.set('model.stacksfactory.plan', this.get('versionDetail.id'));
      this.set('model.stacksfactory.resources.version', this.get('versionDetail.version'));
      this.set('model.stacksfactory.os', this.get('versionDetail.type'));
      this.set('model.distro_description', this.get('versionDetail.description'));
      this.set('active', 'selected');
      this.sendAction('done', this.get('versionDetail.type'));
    }
  }
});
