import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tagName:            'section',
  className:          '',
  selectedSettingTab: 'entitlement',
  panels:             [],

  licenses: function(){
    return isEmpty(this.get('model.license.content')) ? [] : this.get('model.license.content');
  }.property('model.license'),

  actions: {
    triggerReload() {
      this.sendAction('reloadModel');
    }
  }

});
