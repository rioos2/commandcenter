import Component from '@ember/component';

export default Component.extend({
  tagName:          'section',
  className:        '',
  selectedInfraTab: 'sensei',
  panels:           [],

  actions: {
    triggerReload() {
      this.sendAction('reloadModel');
    }
  }

});
