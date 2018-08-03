import Component from '@ember/component';
export default Component.extend({
  actions: {
    doReload() {
      this.sendAction('triggerReload');
    },
  }
});
