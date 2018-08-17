import Component from '@ember/component';

export default Component.extend({
  tagName:            'section',
  className:          '',
  selectedSettingTab: 'entitlement',
  panels:             [],


  actions: {
    triggerReload() {
      this.sendAction('reloadModel');
    }
  }

});
