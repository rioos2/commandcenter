import Component from '@ember/component';

export default Component.extend({
  tagName:            'section',
  className:          '',
  selectedSettingTab: 'alerts',
  panels:             [],


  actions: {
    triggerReload() {
      this.sendAction('reloadModel');
    }
  }

});
